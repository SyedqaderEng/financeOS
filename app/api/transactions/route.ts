import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  category: z.string().min(1),
  type: z.enum(['income', 'expense']),
  date: z.string().or(z.date()).transform(val => new Date(val)),
  accountId: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = createTransactionSchema.parse(body);

    // Get or create default account if not provided
    let accountId = validatedData.accountId;
    if (!accountId) {
      let defaultAccount = await db.account.findFirst({
        where: { userId: user.id, isActive: true },
        orderBy: { createdAt: 'asc' },
      });

      // Create a default account if none exists
      if (!defaultAccount) {
        defaultAccount = await db.account.create({
          data: {
            userId: user.id,
            name: 'Primary Account',
            accountType: 'checking',
            currentBalance: 0,
          },
        });
      }
      accountId = defaultAccount.id;
    }

    // Get or create category
    const categoryName = validatedData.category;
    let category = await db.category.findFirst({
      where: {
        userId: user.id,
        name: { equals: categoryName, mode: 'insensitive' },
      },
    });

    if (!category) {
      // Create category if it doesn't exist
      category = await db.category.create({
        data: {
          userId: user.id,
          name: categoryName,
          isIncome: validatedData.type === 'income',
        },
      });
    }

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        accountId: accountId,
        transactionType: validatedData.type,
        amount: validatedData.amount,
        description: validatedData.description,
        categoryId: category.id,
        date: validatedData.date,
      },
      include: {
        category: true,
        account: true,
      },
    });

    // Update account balance
    if (validatedData.type === 'income') {
      await db.account.update({
        where: { id: accountId },
        data: {
          currentBalance: { increment: validatedData.amount },
        },
      });
    } else {
      await db.account.update({
        where: { id: accountId },
        data: {
          currentBalance: { decrement: validatedData.amount },
        },
      });
    }

    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: error.errors[0]?.message || 'Validation error' } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create transaction' } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type'); // 'income' or 'expense'

    const where: any = { userId: user.id };
    if (type) {
      where.transactionType = type;
    }

    const transactions = await db.transaction.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        account: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, data: transactions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
