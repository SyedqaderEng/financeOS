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
            message: 'You must be logged in to view transactions',
          },
        },
        { status: 401 }
      )
    }

    // Phase 3: Return empty transactions array
    // Phase 4+: Fetch actual recent transactions from database
    const transactions: any[] = []

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: transactions,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Recent transactions error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching recent transactions',
        },
      },
      { status: 500 }
    )
  }
}
