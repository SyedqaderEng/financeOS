import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const type = params.type
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'

    let data: any[] = []

    switch (type) {
      case 'transactions':
        const transactions = await db.transaction.findMany({
          where: { userId: user.id },
          orderBy: { date: 'desc' },
          include: {
            account: {
              select: { name: true }
            },
            category: {
              select: { name: true }
            }
          }
        })
        data = transactions.map(t => ({
          date: t.date.toISOString().split('T')[0],
          description: t.description,
          category: t.category?.name || 'Uncategorized',
          type: t.transactionType,
          amount: parseFloat(t.amount.toString()),
          account: t.account.name,
        }))
        break

      case 'budgets':
        const budgets = await db.budget.findMany({
          where: { userId: user.id },
          include: {
            budgetCategories: true
          }
        })
        data = budgets.flatMap(b =>
          b.budgetCategories.map(c => ({
            budget_name: b.name,
            period: b.periodType,
            category: c.categoryName,
            allocated: parseFloat(c.allocatedAmount.toString()),
            spent: parseFloat(c.spentAmount.toString()),
            start_date: b.startDate.toISOString().split('T')[0],
            end_date: b.endDate.toISOString().split('T')[0],
          }))
        )
        break

      case 'goals':
        const goals = await db.goal.findMany({
          where: { userId: user.id },
          include: {
            contributions: true
          }
        })
        data = goals.map(g => ({
          name: g.name,
          category: g.notes || 'General',
          target_amount: parseFloat(g.targetAmount.toString()),
          current_amount: parseFloat(g.currentAmount.toString()),
          target_date: g.targetDate?.toISOString().split('T')[0] || '',
          status: g.status,
          contributions_count: g.contributions.length,
          progress_percentage: ((parseFloat(g.currentAmount.toString()) / parseFloat(g.targetAmount.toString())) * 100).toFixed(2)
        }))
        break

      case 'analytics':
        // Get transactions for last 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const analyticsTransactions = await db.transaction.findMany({
          where: {
            userId: user.id,
            date: { gte: sixMonthsAgo }
          }
        })

        // Group by month
        const monthlyMap: { [key: string]: { income: number; expenses: number } } = {}
        analyticsTransactions.forEach(t => {
          const monthKey = t.date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { income: 0, expenses: 0 }
          }
          const amount = parseFloat(t.amount.toString())
          if (t.transactionType === 'income') {
            monthlyMap[monthKey].income += amount
          } else if (t.transactionType === 'expense') {
            monthlyMap[monthKey].expenses += amount
          }
        })

        data = Object.entries(monthlyMap).map(([month, values]) => ({
          month,
          income: values.income.toFixed(2),
          expenses: values.expenses.toFixed(2),
          net: (values.income - values.expenses).toFixed(2),
          savings_rate: values.income > 0 ? ((values.income - values.expenses) / values.income * 100).toFixed(2) + '%' : '0%'
        }))
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid export type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data,
      format,
      count: data.length
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
