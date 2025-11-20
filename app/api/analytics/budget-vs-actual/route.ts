import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get current month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get active budgets for current month
    const budgets = await db.budget.findMany({
      where: {
        userId: user.id,
        startDate: { lte: endOfMonth },
        endDate: { gte: startOfMonth },
      },
      include: {
        budgetCategories: true,
      },
    })

    if (budgets.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    // Get transactions for current month
    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        transactionType: 'expense',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    })

    // Calculate spending by category
    const spendingMap: { [key: string]: number } = {}
    transactions.forEach(t => {
      const category = t.category || 'Uncategorized'
      const amount = parseFloat(t.amount.toString())
      spendingMap[category] = (spendingMap[category] || 0) + amount
    })

    // Build budget vs actual data
    const budgetData: any[] = []
    budgets.forEach(budget => {
      budget.budgetCategories.forEach(category => {
        const budgeted = parseFloat(category.allocatedAmount.toString())
        const spent = spendingMap[category.categoryName] || 0

        budgetData.push({
          category: category.categoryName,
          budgeted: Math.round(budgeted),
          spent: Math.round(spent),
          remaining: Math.round(budgeted - spent),
        })
      })
    })

    // Sort by budgeted amount (descending)
    budgetData.sort((a, b) => b.budgeted - a.budgeted)

    // Return top 8 categories
    return NextResponse.json({
      success: true,
      data: budgetData.slice(0, 8),
    })
  } catch (error) {
    console.error('Error fetching budget vs actual:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget comparison' },
      { status: 500 }
    )
  }
}
