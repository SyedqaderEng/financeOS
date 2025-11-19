import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createBudgetSchema = z.object({
  name: z.string().min(1),
  periodType: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string().or(z.date()).transform(val => new Date(val)),
  endDate: z.string().or(z.date()).transform(val => new Date(val)),
  categories: z.array(z.object({
    categoryId: z.string(),
    categoryName: z.string(),
    budgetedAmount: z.number().positive(),
    alertThreshold: z.number().min(0).max(100).optional().default(90),
  })),
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
    const validatedData = createBudgetSchema.parse(body);

    // Create budget with categories in a transaction
    const budget = await db.budget.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        periodType: validatedData.periodType,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        budgetCategories: {
          create: await Promise.all(validatedData.categories.map(async (cat) => {
            // Get or create category
            let category = await db.category.findFirst({
              where: {
                userId: user.id,
                name: { equals: cat.categoryName, mode: 'insensitive' },
              },
            });

            if (!category) {
              category = await db.category.create({
                data: {
                  userId: user.id,
                  name: cat.categoryName,
                  isIncome: false,
                },
              });
            }

            return {
              categoryId: category.id,
              budgetedAmount: cat.budgetedAmount,
              alertThreshold: cat.alertThreshold || 90,
            };
          })),
        },
      },
      include: {
        budgetCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: budget }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: error.errors[0]?.message || 'Validation error' } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create budget' } },
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
    const periodType = searchParams.get('periodType');
    const includeStats = searchParams.get('includeStats') === 'true';

    // Get current date
    const now = new Date();

    // Build where clause
    const where: any = {
      userId: user.id,
      isTemplate: false,
    };

    if (periodType) {
      where.periodType = periodType;
    }

    // Get active budgets (current or future)
    where.endDate = { gte: now };

    const budgets = await db.budget.findMany({
      where,
      include: {
        budgetCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    // If includeStats, calculate spent amounts for each budget
    if (includeStats) {
      const budgetsWithStats = await Promise.all(
        budgets.map(async (budget: any) => {
          const categoriesWithSpent = await Promise.all(
            budget.budgetCategories.map(async (bc: any) => {
              // Calculate spent amount for this category in budget period
              const spent = await db.transaction.aggregate({
                where: {
                  userId: user.id,
                  categoryId: bc.categoryId,
                  transactionType: 'expense',
                  date: {
                    gte: budget.startDate,
                    lte: budget.endDate,
                  },
                },
                _sum: {
                  amount: true,
                },
              });

              return {
                ...bc,
                spent: parseFloat(spent._sum.amount?.toString() || '0'),
                budgeted: parseFloat(bc.budgetedAmount.toString()),
              };
            })
          );

          return {
            ...budget,
            budgetCategories: categoriesWithSpent,
          };
        })
      );

      return NextResponse.json({ success: true, data: budgetsWithStats }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: budgets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
