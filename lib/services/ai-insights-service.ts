// AI-Powered Financial Insights Service
import { db } from '@/lib/db'

export interface Insight {
  type: 'warning' | 'opportunity' | 'tip' | 'alert' | 'recommendation'
  priority: 'low' | 'medium' | 'high'
  title: string
  message: string
  actionLabel?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export class AIInsightsService {
  /**
   * Generate comprehensive financial insights for a user
   */
  async generateInsights(userId: string): Promise<Insight[]> {
    const insights: Insight[] = []

    try {
      // Run all analyses in parallel
      const [
        spendingAnomalies,
        subscriptions,
        budgetPerformance,
        savingsRate,
        portfolioAnalysis
      ] = await Promise.all([
        this.detectSpendingAnomalies(userId),
        this.findUnusedSubscriptions(userId),
        this.analyzeBudgetPerformance(userId),
        this.calculateSavingsRate(userId),
        this.analyzePortfolioDiversification(userId)
      ])

      // 1. Spending Anomalies
      if (spendingAnomalies.length > 0) {
        const anomaly = spendingAnomalies[0]
        insights.push({
          type: 'warning',
          priority: 'high',
          title: 'Unusual Spending Detected',
          message: `You've spent ${anomaly.percentIncrease}% more on ${anomaly.category} this month ($${anomaly.thisMonth.toFixed(0)} vs $${anomaly.average.toFixed(0)} average).`,
          actionLabel: 'Review Transactions',
          actionUrl: `/app/transactions?category=${anomaly.category}`,
          metadata: { category: anomaly.category }
        })
      }

      // 2. Unused Subscriptions
      if (subscriptions.length > 0) {
        const totalWaste = subscriptions.reduce((sum, sub) => sum + sub.monthlyAmount, 0)
        insights.push({
          type: 'opportunity',
          priority: 'medium',
          title: `Save $${totalWaste.toFixed(0)}/mo on Subscriptions`,
          message: `We detected ${subscriptions.length} subscription${subscriptions.length > 1 ? 's' : ''} you might not be using: ${subscriptions.map(s => s.name).join(', ')}.`,
          actionLabel: 'Manage Subscriptions',
          actionUrl: '/app/subscriptions',
          metadata: { potentialSavings: totalWaste }
        })
      }

      // 3. Budget Performance
      if (budgetPerformance.overBudget.length > 0) {
        insights.push({
          type: 'alert',
          priority: 'high',
          title: 'Budget Alert',
          message: `You're over budget in ${budgetPerformance.overBudget.length} categor${budgetPerformance.overBudget.length > 1 ? 'ies' : 'y'}: ${budgetPerformance.overBudget.map(c => c.category).join(', ')}.`,
          actionLabel: 'Adjust Budget',
          actionUrl: '/app/budgets'
        })
      } else if (budgetPerformance.onTrack > 0) {
        insights.push({
          type: 'tip',
          priority: 'low',
          title: 'Great Budget Management!',
          message: `You're on track with ${budgetPerformance.onTrack} out of ${budgetPerformance.total} budgets. Keep it up!`,
          actionLabel: 'View Budgets',
          actionUrl: '/app/budgets'
        })
      }

      // 4. Savings Rate
      if (savingsRate !== null) {
        if (savingsRate < 10) {
          insights.push({
            type: 'tip',
            priority: 'medium',
            title: 'Increase Your Savings',
            message: `Your savings rate is ${savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of your income. Try setting aside $${this.suggestSavingsIncrease(userId, savingsRate)} more per month.`,
            actionLabel: 'Set Savings Goal',
            actionUrl: '/app/goals'
          })
        } else if (savingsRate >= 20) {
          insights.push({
            type: 'tip',
            priority: 'low',
            title: 'Excellent Savings Rate!',
            message: `Your ${savingsRate.toFixed(1)}% savings rate is above the recommended 20%. You're building wealth effectively!`,
            actionLabel: 'View Goals',
            actionUrl: '/app/goals'
          })
        }
      }

      // 5. Portfolio Diversification
      if (portfolioAnalysis && !portfolioAnalysis.isDiversified) {
        insights.push({
          type: 'recommendation',
          priority: 'medium',
          title: 'Diversify Your Portfolio',
          message: `${portfolioAnalysis.concentration.toFixed(0)}% of your portfolio is in ${portfolioAnalysis.topHolding}. Consider diversifying to reduce risk.`,
          actionLabel: 'View Portfolio',
          actionUrl: '/app/investments'
        })
      }

      // Sort by priority
      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    } catch (error) {
      console.error('Error generating insights:', error)
      return []
    }
  }

  /**
   * Detect unusual spending patterns using statistical analysis
   */
  private async detectSpendingAnomalies(userId: string) {
    const now = new Date()
    const startOf90Days = new Date(now)
    startOf90Days.setDate(now.getDate() - 90)

    const transactions = await db.transaction.findMany({
      where: {
        userId,
        transactionType: 'expense',
        date: { gte: startOf90Days }
      },
      include: {
        category: { select: { name: true } }
      }
    })

    // Group by category and month
    const categoryMonthly: Record<string, Record<string, number>> = {}

    transactions.forEach(t => {
      const categoryName = t.category?.name || 'Uncategorized'
      const month = `${t.date.getFullYear()}-${t.date.getMonth()}`

      if (!categoryMonthly[categoryName]) {
        categoryMonthly[categoryName] = {}
      }

      categoryMonthly[categoryName][month] = (categoryMonthly[categoryName][month] || 0) + parseFloat(t.amount.toString())
    })

    const anomalies = []
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`

    for (const [category, months] of Object.entries(categoryMonthly)) {
      const monthlyAmounts = Object.values(months)
      if (monthlyAmounts.length < 2) continue

      const thisMonth = months[currentMonth] || 0
      const previousMonths = monthlyAmounts.filter((_, idx) => Object.keys(months)[idx] !== currentMonth)
      const average = previousMonths.reduce((sum, val) => sum + val, 0) / previousMonths.length

      // Check if this month is 50% above average
      if (thisMonth > average * 1.5 && average > 0) {
        anomalies.push({
          category,
          thisMonth,
          average,
          percentIncrease: ((thisMonth - average) / average * 100)
        })
      }
    }

    return anomalies.sort((a, b) => b.percentIncrease - a.percentIncrease)
  }

  /**
   * Find subscriptions that might not be used
   */
  private async findUnusedSubscriptions(userId: string) {
    const subscriptions = await db.subscription.findMany({
      where: {
        userId,
        status: 'active'
      }
    })

    // Simple heuristic: flag subscriptions over $10/month
    // In production, you'd check transaction history to see if they're actually being charged
    return subscriptions
      .filter(sub => parseFloat(sub.cost.toString()) > 10)
      .map(sub => ({
        name: sub.serviceName,
        monthlyAmount: parseFloat(sub.cost.toString())
      }))
      .slice(0, 3) // Top 3
  }

  /**
   * Analyze budget performance
   */
  private async analyzeBudgetPerformance(userId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const budgets = await db.budgetCategory.findMany({
      where: {
        budget: {
          userId,
          startDate: { lte: endOfMonth },
          endDate: { gte: startOfMonth }
        }
      },
      include: {
        budget: true,
        category: { select: { name: true } }
      }
    })

    if (budgets.length === 0) {
      return { overBudget: [], onTrack: 0, total: 0 }
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId,
        transactionType: 'expense',
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      include: {
        category: { select: { name: true } }
      }
    })

    const overBudget: Array<{ category: string; spent: number; budgeted: number }> = []
    let onTrack = 0

    budgets.forEach(budgetCat => {
      const categoryName = budgetCat.category.name
      const budgeted = parseFloat(budgetCat.budgetedAmount.toString())
      const spent = transactions
        .filter(t => t.category?.name === categoryName)
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

      if (spent > budgeted) {
        overBudget.push({ category: categoryName, spent, budgeted })
      } else {
        onTrack++
      }
    })

    return {
      overBudget: overBudget.sort((a, b) => (b.spent - b.budgeted) - (a.spent - a.budgeted)),
      onTrack,
      total: budgets.length
    }
  }

  /**
   * Calculate savings rate
   */
  private async calculateSavingsRate(userId: string): Promise<number | null> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const transactions = await db.transaction.findMany({
      where: {
        userId,
        date: { gte: startOfMonth }
      }
    })

    const income = transactions
      .filter(t => t.transactionType === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

    const expenses = transactions
      .filter(t => t.transactionType === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

    if (income === 0) return null

    return ((income - expenses) / income) * 100
  }

  /**
   * Suggest savings increase amount
   */
  private suggestSavingsIncrease(userId: string, currentRate: number): string {
    // Suggest increasing to 20% savings rate
    // This is a simplified calculation - in production, fetch actual income
    const targetRate = 20
    const increaseNeeded = targetRate - currentRate
    const suggestedAmount = Math.round((increaseNeeded / 100) * 5000) // Assuming $5k monthly income
    return suggestedAmount.toString()
  }

  /**
   * Analyze portfolio diversification
   */
  private async analyzePortfolioDiversification(userId: string) {
    const investments = await db.investment.findMany({
      where: { userId }
    })

    if (investments.length === 0) return null

    const totalValue = investments.reduce((sum, inv) => {
      return sum + parseFloat(inv.currentValue?.toString() || '0')
    }, 0)

    if (totalValue === 0) return null

    // Find largest holding
    const holdingValues = investments.map(inv => ({
      symbol: inv.symbol,
      value: parseFloat(inv.currentValue?.toString() || '0')
    }))

    const topHolding = holdingValues.reduce((max, holding) =>
      holding.value > max.value ? holding : max
    , { symbol: '', value: 0 })

    const concentration = (topHolding.value / totalValue) * 100

    // Portfolio is considered diversified if no single holding exceeds 20%
    return {
      isDiversified: concentration < 20,
      topHolding: topHolding.symbol,
      concentration
    }
  }
}

// Singleton instance
export const aiInsightsService = new AIInsightsService()
