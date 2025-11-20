import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get all accounts
    const accounts = await db.account.findMany({
      where: { userId: user.id },
    })

    // Get transactions for last 6 months to calculate historical net worth
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

    // Initialize monthly data
    const monthlyData: { [key: string]: { assets: number; liabilities: number } } = {}
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      monthlyData[monthKey] = { assets: 0, liabilities: 0 }
    }

    // Calculate current assets and liabilities
    let currentAssets = 0
    let currentLiabilities = 0

    accounts.forEach(account => {
      const balance = parseFloat(account.currentBalance.toString())
      if (account.accountType === 'credit') {
        currentLiabilities += Math.abs(balance)
      } else {
        currentAssets += balance
      }
    })

    // Calculate net worth for each month (simplified - using current balances minus transaction changes)
    const monthKeys = Object.keys(monthlyData)
    let runningAssets = currentAssets
    let runningLiabilities = currentLiabilities

    // Work backwards from current month
    for (let i = monthKeys.length - 1; i >= 0; i--) {
      const monthKey = monthKeys[i]

      // Set values for this month
      monthlyData[monthKey].assets = runningAssets
      monthlyData[monthKey].liabilities = runningLiabilities

      // If not the first month, adjust for previous month's transactions
      if (i > 0) {
        const currentMonth = new Date(monthKey)
        const monthTransactions = transactions.filter(t => {
          const tDate = new Date(t.date)
          return tDate.getMonth() === currentMonth.getMonth() &&
                 tDate.getFullYear() === currentMonth.getFullYear()
        })

        // Adjust running totals
        monthTransactions.forEach(t => {
          const amount = parseFloat(t.amount.toString())
          if (t.transactionType === 'income') {
            runningAssets -= amount
          } else if (t.transactionType === 'expense') {
            runningAssets += amount
          }
        })
      }
    }

    // Convert to array format
    const netWorthData = Object.entries(monthlyData).map(([month, values]) => ({
      month,
      assets: Math.round(values.assets),
      liabilities: Math.round(values.liabilities),
      netWorth: Math.round(values.assets - values.liabilities),
    }))

    return NextResponse.json({
      success: true,
      data: netWorthData,
    })
  } catch (error) {
    console.error('Error fetching net worth:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch net worth data' },
      { status: 500 }
    )
  }
}
