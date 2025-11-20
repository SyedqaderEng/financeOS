import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/budgets/:id - Get a single budget
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const budgetId = params.id

    const budget = await db.budget.findUnique({
      where: { id: budgetId },
    })

    if (!budget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (budget.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: budget,
    })
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget' },
      { status: 500 }
    )
  }
}

// PUT /api/budgets/:id - Update a budget
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const budgetId = params.id
    const body = await request.json()

    const { name, category, amount, period, alertThreshold } = body

    // Validate required fields
    if (!name || !category || !amount || !period || alertThreshold === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the budget to verify ownership
    const existingBudget = await db.budget.findUnique({
      where: { id: budgetId },
    })

    if (!existingBudget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (existingBudget.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Validate period
    const validPeriods = ['weekly', 'monthly', 'quarterly', 'yearly']
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { success: false, error: 'Invalid period' },
        { status: 400 }
      )
    }

    // Validate alert threshold
    const threshold = parseInt(alertThreshold)
    if (threshold < 1 || threshold > 100) {
      return NextResponse.json(
        { success: false, error: 'Alert threshold must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Update the budget
    const updatedBudget = await db.budget.update({
      where: { id: budgetId },
      data: {
        name,
        category,
        amount: parseFloat(amount),
        period,
        alertThreshold: threshold,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedBudget,
      message: 'Budget updated successfully',
    })
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update budget' },
      { status: 500 }
    )
  }
}

// DELETE /api/budgets/:id - Delete a budget
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const budgetId = params.id

    // Get the budget to verify ownership
    const budget = await db.budget.findUnique({
      where: { id: budgetId },
    })

    if (!budget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (budget.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the budget
    await db.budget.delete({
      where: { id: budgetId },
    })

    return NextResponse.json({
      success: true,
      message: 'Budget deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    )
  }
}
