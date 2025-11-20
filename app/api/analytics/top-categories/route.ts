import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const sixtyDaysAgo = new Date(now)
    sixtyDaysAgo.setDate(now.getDate() - 60)

    // Get current period (last 30 days)
    const currentPeriod = await db.transaction.findMany({
      where: {
        userId: user.id,
        transactionType: 'expense',
        date: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Get previous period (30-60 days ago)
    const previousPeriod = await db.transaction.findMany({
      where: {
        userId: user.id,
        transactionType: 'expense',
        date: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    })

    // Calculate current period totals
    const currentMap: { [key: string]: { amount: number; count: number } } = {}
    currentPeriod.forEach(t => {
      const category = t.category || 'Uncategorized'
      const amount = parseFloat(t.amount.toString())
      if (!currentMap[category]) {
        currentMap[category] = { amount: 0, count: 0 }
      }
      currentMap[category].amount += amount
      currentMap[category].count += 1
    })

    // Calculate previous period totals
    const previousMap: { [key: string]: number } = {}
    previousPeriod.forEach(t => {
      const category = t.category || 'Uncategorized'
      const amount = parseFloat(t.amount.toString())
      previousMap[category] = (previousMap[category] || 0) + amount
    })

    // Calculate total for percentage
    const total = Object.values(currentMap).reduce((sum, data) => sum + data.amount, 0)

    // Build category data with trends
    const categoryData = Object.entries(currentMap)
      .map(([category, data]) => {
        const previousAmount = previousMap[category] || 0
        let trend = 0
        if (previousAmount > 0) {
          trend = Math.round(((data.amount - previousAmount) / previousAmount) * 100)
        } else if (data.amount > 0) {
          trend = 100
        }

        return {
          category,
          amount: Math.round(data.amount),
          percentage: total > 0 ? (data.amount / total) * 100 : 0,
          trend,
          transactionCount: data.count,
        }
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5) // Top 5 categories

    return NextResponse.json({
      success: true,
      data: categoryData,
    })
  } catch (error) {
    console.error('Error fetching top categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top categories' },
      { status: 500 }
    )
  }
}
