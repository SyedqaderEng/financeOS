import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get transactions for last 30 days
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        transactionType: 'expense',
        date: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        category: true,
        amount: true,
      },
    })

    // Group by category
    const categoryMap: { [key: string]: number } = {}

    transactions.forEach(t => {
      // Extract category name (handle both string and object cases)
      let categoryName: string
      if (typeof t.category === 'string') {
        categoryName = t.category || 'Uncategorized'
      } else if (t.category && typeof t.category === 'object') {
        // If category is an object, try to get the name property
        categoryName = (t.category as any).name || 'Uncategorized'
      } else {
        categoryName = 'Uncategorized'
      }

      const amount = parseFloat(t.amount.toString())
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + amount
    })

    // Calculate total
    const total = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0)

    // Convert to array with percentages
    const categoryData = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount),
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8) // Top 8 categories

    return NextResponse.json({
      success: true,
      data: categoryData,
    })
  } catch (error) {
    console.error('Error fetching category spending:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category spending' },
      { status: 500 }
    )
  }
}
