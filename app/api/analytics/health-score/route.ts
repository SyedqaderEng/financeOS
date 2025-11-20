import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get current month date range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get transactions for current month
    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        transactionType: true,
        amount: true,
        category: true,
      },
    })

    // Helper function to extract category name
    const getCategoryName = (category: any): string => {
      if (typeof category === 'string') {
        return category || 'Uncategorized'
      } else if (category && typeof category === 'object') {
        return category.name || 'Uncategorized'
      }
      return 'Uncategorized'
    }

    // Calculate income and expenses
    const income = transactions
      .filter(t => t.transactionType === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

    const expenses = transactions
      .filter(t => t.transactionType === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

    const savings = income - expenses

    // Calculate savings rate
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0

    // Get total account balances
    const accounts = await db.account.findMany({
      where: { userId: user.id },
    })

    const totalAssets = accounts
      .filter(a => a.accountType !== 'credit')
      .reduce((sum, a) => sum + parseFloat(a.currentBalance.toString()), 0)

    const totalDebts = accounts
      .filter(a => a.accountType === 'credit')
      .reduce((sum, a) => sum + Math.abs(parseFloat(a.currentBalance.toString())), 0)

    // Calculate debt-to-income ratio
    const debtToIncomeRatio = income > 0 ? Math.round((totalDebts / income) * 100) : 0

    // Calculate emergency fund (in months)
    const monthlyExpenses = expenses
    const emergencyFundMonths = monthlyExpenses > 0 ? totalAssets / monthlyExpenses : 0

    // Get budget adherence
    const budgets = await db.budgetCategory.findMany({
      where: {
        budget: {
          userId: user.id,
          startDate: { lte: endOfMonth },
          endDate: { gte: startOfMonth },
        },
      },
      include: {
        budget: true,
      },
    })

    let budgetAdherence = 100
    if (budgets.length > 0) {
      const budgetStats = budgets.map(b => {
        const spent = transactions
          .filter(t => {
            if (t.transactionType !== 'expense') return false
            const categoryName = getCategoryName(t.category)
            return categoryName === b.categoryName
          })
          .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
        const budgeted = parseFloat(b.allocatedAmount.toString())
        return spent <= budgeted ? 100 : Math.max(0, 100 - ((spent - budgeted) / budgeted) * 100)
      })
      budgetAdherence = Math.round(budgetStats.reduce((a, b) => a + b, 0) / budgetStats.length)
    }

    // Calculate overall health score
    let score = 0

    // Savings rate (0-30 points)
    if (savingsRate >= 20) score += 30
    else if (savingsRate >= 10) score += 20
    else if (savingsRate >= 5) score += 10

    // Emergency fund (0-25 points)
    if (emergencyFundMonths >= 6) score += 25
    else if (emergencyFundMonths >= 3) score += 20
    else if (emergencyFundMonths >= 1) score += 10

    // Debt-to-income ratio (0-25 points)
    if (debtToIncomeRatio <= 20) score += 25
    else if (debtToIncomeRatio <= 36) score += 15
    else if (debtToIncomeRatio <= 50) score += 5

    // Budget adherence (0-20 points)
    score += Math.round(budgetAdherence * 0.2)

    return NextResponse.json({
      success: true,
      data: {
        score: Math.min(100, score),
        savingsRate: Math.max(0, savingsRate),
        debtToIncomeRatio: Math.max(0, debtToIncomeRatio),
        emergencyFundMonths,
        budgetAdherence,
      },
    })
  } catch (error) {
    console.error('Error calculating health score:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate health score' },
      { status: 500 }
    )
  }
}
