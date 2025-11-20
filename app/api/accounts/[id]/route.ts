import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/accounts/:id - Get a single account
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = params.id

    const account = await db.account.findUnique({
      where: { id: accountId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    })

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (account.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: account,
    })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch account' },
      { status: 500 }
    )
  }
}

// PUT /api/accounts/:id - Update an account
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = params.id
    const body = await request.json()

    const { name, type, balance, institution } = body

    // Validate required fields
    if (!name || !type || balance === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the account to verify ownership
    const existingAccount = await db.account.findUnique({
      where: { id: accountId },
    })

    if (!existingAccount) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (existingAccount.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Validate account type
    const validTypes = ['checking', 'savings', 'credit', 'investment']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account type' },
        { status: 400 }
      )
    }

    // Update the account
    const updatedAccount = await db.account.update({
      where: { id: accountId },
      data: {
        name,
        type,
        balance: parseFloat(balance),
        institution: institution || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedAccount,
      message: 'Account updated successfully',
    })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update account' },
      { status: 500 }
    )
  }
}

// DELETE /api/accounts/:id - Delete an account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = params.id

    // Get the account to verify ownership
    const account = await db.account.findUnique({
      where: { id: accountId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    })

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (account.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the account and all associated transactions
    // Prisma will handle cascading deletes based on schema
    await db.account.delete({
      where: { id: accountId },
    })

    return NextResponse.json({
      success: true,
      message: `Account deleted successfully. ${account._count.transactions} associated transactions were also deleted.`,
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
