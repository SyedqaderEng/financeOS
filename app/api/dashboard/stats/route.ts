import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/types'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view dashboard stats',
          },
        },
        { status: 401 }
      )
    }

    // Get all active accounts
    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
    })

    // Calculate total balance across all accounts
    const totalBalance = accounts.reduce((sum: number, account: any) => {
      return sum + parseFloat(account.currentBalance.toString())
    }, 0)

    // Get current month date range
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get previous month for comparison
    const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get current month income
    const currentMonthIncome = await db.transaction.aggregate({
      where: {
        userId: user.id,
        transactionType: 'income',
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    })

    // Get previous month income for comparison
    const prevMonthIncome = await db.transaction.aggregate({
      where: {
        userId: user.id,
        transactionType: 'income',
        date: {
          gte: firstDayOfPrevMonth,
          lte: lastDayOfPrevMonth,
        },
      },
      _sum: {
        amount: true,
      },
    })

    // Get current month expenses
    const currentMonthExpenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        transactionType: 'expense',
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    })

    // Get previous month expenses for comparison
    const prevMonthExpenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        transactionType: 'expense',
        date: {
          gte: firstDayOfPrevMonth,
          lte: lastDayOfPrevMonth,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const monthlyIncome = parseFloat(currentMonthIncome._sum.amount?.toString() || '0')
    const monthlyExpenses = parseFloat(currentMonthExpenses._sum.amount?.toString() || '0')
    const prevIncome = parseFloat(prevMonthIncome._sum.amount?.toString() || '0')
    const prevExpenses = parseFloat(prevMonthExpenses._sum.amount?.toString() || '0')

    // Calculate percentage changes
    const incomeChange = prevIncome > 0 ? ((monthlyIncome - prevIncome) / prevIncome) * 100 : 0
    const expenseChange = prevExpenses > 0 ? ((monthlyExpenses - prevExpenses) / prevExpenses) * 100 : 0

    // Calculate net worth (simplified: total balance)
    const netWorth = totalBalance

    // Get transaction count
    const transactionsCount = await db.transaction.count({
      where: { userId: user.id },
    })

    const stats = {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      netWorth,
      accountsCount: accounts.length,
      transactionsCount,
      trends: {
        income: {
          value: incomeChange,
          isPositive: incomeChange >= 0,
        },
        expenses: {
          value: Math.abs(expenseChange),
          isPositive: expenseChange < 0, // Lower expenses is positive
        },
        netWorth: {
          value: incomeChange > 0 ? incomeChange : 0,
          isPositive: true,
        },
      },
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: stats,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching dashboard stats',
        },
      },
      { status: 500 }
    )
  }
}
