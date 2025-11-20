import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/goals/:id - Get a single goal
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

    return NextResponse.json({
      success: true,
      data: goal,
    })
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch goal' },
      { status: 500 }
    )
  }
}

// PUT /api/goals/:id - Update a goal
export async function PUT(
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

    const { name, category, targetAmount, targetDate } = body

    // Validate required fields
    if (!name || !category || !targetAmount || !targetDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the goal to verify ownership
    const existingGoal = await db.goal.findUnique({
      where: { id: goalId },
    })

    if (!existingGoal) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (existingGoal.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Validate target amount
    const amount = parseFloat(targetAmount)
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Target amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Update the goal
    const updatedGoal = await db.goal.update({
      where: { id: goalId },
      data: {
        name,
        category,
        targetAmount: amount,
        targetDate: new Date(targetDate),
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedGoal,
      message: 'Goal updated successfully',
    })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

// DELETE /api/goals/:id - Delete a goal
export async function DELETE(
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

    // Delete the goal
    await db.goal.delete({
      where: { id: goalId },
    })

    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}
