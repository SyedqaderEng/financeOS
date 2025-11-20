import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// DELETE /api/transactions/:id - Delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const transactionId = params.id

    // Get the transaction first to verify ownership and get the amount
    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true },
    })

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Verify the transaction belongs to the user's account
    if (transaction.account.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Reverse the account balance change
    const balanceAdjustment =
      transaction.transactionType === 'income'
        ? -transaction.amount // Remove income
        : transaction.amount // Add back expense

    // Update account balance and delete transaction in a transaction
    await db.$transaction([
      db.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: balanceAdjustment,
          },
        },
      }),
      db.transaction.delete({
        where: { id: transactionId },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}

// PUT /api/transactions/:id - Update a transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const transactionId = params.id
    const body = await request.json()

    const { description, amount, category, date, transactionType, accountId } = body

    // Validate required fields
    if (!description || !amount || !category || !date || !transactionType || !accountId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the original transaction
    const originalTransaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true },
    })

    if (!originalTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (originalTransaction.account.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Verify the new account belongs to the user
    const newAccount = await db.account.findUnique({
      where: { id: accountId },
    })

    if (!newAccount || newAccount.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid account' },
        { status: 400 }
      )
    }

    // Calculate balance adjustments
    // First, reverse the original transaction's effect
    const originalBalanceAdjustment =
      originalTransaction.transactionType === 'income'
        ? -originalTransaction.amount
        : originalTransaction.amount

    // Then apply the new transaction's effect
    const newBalanceAdjustment =
      transactionType === 'income' ? parseFloat(amount) : -parseFloat(amount)

    // Create or get category
    let categoryRecord = await db.category.findFirst({
      where: {
        name: category,
        userId: user.id,
      },
    })

    if (!categoryRecord) {
      categoryRecord = await db.category.create({
        data: {
          name: category,
          type: transactionType,
          userId: user.id,
        },
      })
    }

    // Update transaction and adjust account balances
    const updates = []

    // If account changed, update both old and new account balances
    if (originalTransaction.accountId !== accountId) {
      // Reverse original transaction from old account
      updates.push(
        db.account.update({
          where: { id: originalTransaction.accountId },
          data: {
            balance: {
              increment: originalBalanceAdjustment,
            },
          },
        })
      )

      // Apply new transaction to new account
      updates.push(
        db.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: newBalanceAdjustment,
            },
          },
        })
      )
    } else {
      // Same account, calculate the net change
      const netChange = newBalanceAdjustment - (originalTransaction.transactionType === 'income' ? originalTransaction.amount : -originalTransaction.amount)

      updates.push(
        db.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: netChange,
            },
          },
        })
      )
    }

    // Update the transaction
    updates.push(
      db.transaction.update({
        where: { id: transactionId },
        data: {
          description,
          amount: parseFloat(amount),
          category: category,
          date: new Date(date),
          transactionType,
          accountId,
          categoryId: categoryRecord.id,
        },
      })
    )

    const [updatedTransaction] = await db.$transaction(updates)

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully',
    })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// GET /api/transactions/:id - Get a single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const transactionId = params.id

    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: {
        account: true,
        category: true,
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (transaction.account.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}
