import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get transactions for last 6 months
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Group by month
    const monthlyMap: { [key: string]: { income: number; expenses: number } } = {}

    // Initialize all 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      monthlyMap[monthKey] = { income: 0, expenses: 0 }
    }

    // Aggregate transactions
    transactions.forEach(t => {
      const date = new Date(t.date)
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })

      if (monthlyMap[monthKey]) {
        const amount = parseFloat(t.amount.toString())
        if (t.transactionType === 'income') {
          monthlyMap[monthKey].income += amount
        } else if (t.transactionType === 'expense') {
          monthlyMap[monthKey].expenses += amount
        }
      }
    })

    // Convert to array
    const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      income: Math.round(data.income),
      expenses: Math.round(data.expenses),
      net: Math.round(data.income - data.expenses),
    }))

    return NextResponse.json({
      success: true,
      data: monthlyData,
    })
  } catch (error) {
    console.error('Error fetching monthly trends:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monthly trends' },
      { status: 500 }
    )
  }
}
