import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// POST /api/goals/:id/contribute - Add a contribution to a goal
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const goalId = params.id
    const body = await request.json()

    const { amount, notes } = body

    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Contribution amount must be greater than 0' },
        { status: 400 }
      )
    }

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

    // Add the contribution
    const contributionAmount = parseFloat(amount)
    const newAmount = goal.currentAmount + contributionAmount
    const wasCompleted = goal.currentAmount >= goal.targetAmount
    const isNowCompleted = newAmount >= goal.targetAmount

    // Use transaction to ensure both updates happen
    const [updatedGoal, contribution] = await db.$transaction([
      db.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: newAmount,
          status: isNowCompleted && !wasCompleted ? 'completed' : goal.status,
        },
      }),
      db.goalContribution.create({
        data: {
          goalId,
          amount: contributionAmount,
          contributionDate: new Date(),
          notes: notes || null,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: updatedGoal,
      goalCompleted: isNowCompleted && !wasCompleted,
      message: `Added $${contributionAmount.toFixed(2)} to ${goal.name}`,
    })
  } catch (error) {
    console.error('Error adding contribution:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add contribution' },
      { status: 500 }
    )
  }
}
