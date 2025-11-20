import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/goals - Get all goals for the user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const goals = await db.goal.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        targetDate: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: goals,
    })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, category, targetAmount, targetDate } = body

    // Validate required fields
    if (!name || !category || !targetAmount || !targetDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
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

    // Validate target date is in the future
    const target = new Date(targetDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (target < today) {
      return NextResponse.json(
        { success: false, error: 'Target date must be in the future' },
        { status: 400 }
      )
    }

    // Create the goal
    const goal = await db.goal.create({
      data: {
        name,
        category,
        targetAmount: amount,
        currentAmount: 0,
        targetDate: new Date(targetDate),
        userId: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: goal,
      message: 'Goal created successfully',
    })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}
