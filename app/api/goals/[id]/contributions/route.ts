import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/goals/:id/contributions - Get contribution history for a goal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const goalId = params.id

    // Get the goal to verify ownership
    const goal = await db.goal.findUnique({
      where: { id: goalId },
    })

    if (!goal) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (goal.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Fetch contribution history
    const contributions = await db.goalContribution.findMany({
      where: { goalId },
      orderBy: {
        contributionDate: 'desc',
      },
    })

    // Calculate running totals
    let runningTotal = 0
    const contributionsWithTotal = contributions.reverse().map((contribution) => {
      runningTotal += parseFloat(contribution.amount.toString())
      return {
        ...contribution,
        runningTotal,
      }
    }).reverse()

    return NextResponse.json({
      success: true,
      data: contributionsWithTotal,
    })
  } catch (error) {
    console.error('Error fetching contribution history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contribution history' },
      { status: 500 }
    )
  }
}
