import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
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

    // Phase 3: Return empty stats
    // Phase 4+: Calculate actual stats from database
    const stats = {
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      netWorth: 0,
      accountsCount: 0,
      transactionsCount: 0,
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
