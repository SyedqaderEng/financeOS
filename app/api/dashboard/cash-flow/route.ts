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
            message: 'You must be logged in to view cash flow data',
          },
        },
        { status: 401 }
      )
    }

    // Phase 3: Return empty cash flow data
    // Phase 4+: Calculate actual cash flow from transactions
    const cashFlow = {
      labels: [],
      income: [],
      expenses: [],
      net: [],
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: cashFlow,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Cash flow error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching cash flow data',
        },
      },
      { status: 500 }
    )
  }
}
