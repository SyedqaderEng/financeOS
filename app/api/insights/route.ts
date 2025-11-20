import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { aiInsightsService } from '@/lib/services/ai-insights-service'

// GET /api/insights - Get AI-generated financial insights
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const fresh = searchParams.get('fresh') === 'true'

    // If fresh insights requested, generate new ones
    if (fresh) {
      const insights = await aiInsightsService.generateInsights(user.id)
      return NextResponse.json({ insights })
    }

    // Otherwise, try to fetch from database first
    const storedInsights = await db.aIInsight.findMany({
      where: {
        userId: user.id,
        isDismissed: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // If we have recent insights, return them
    if (storedInsights.length > 0) {
      const insights = storedInsights.map(insight => ({
        type: insight.insightType,
        priority: insight.priority,
        title: insight.title,
        message: insight.message,
        actionLabel: insight.actionLabel,
        actionUrl: insight.actionUrl,
        metadata: insight.metadata as Record<string, any>
      }))

      return NextResponse.json({ insights, cached: true })
    }

    // Generate fresh insights if none found
    const insights = await aiInsightsService.generateInsights(user.id)

    // Store insights in database for caching
    await Promise.all(
      insights.map(insight =>
        db.aIInsight.create({
          data: {
            userId: user.id,
            insightType: insight.type,
            priority: insight.priority,
            title: insight.title,
            message: insight.message,
            actionLabel: insight.actionLabel,
            actionUrl: insight.actionUrl,
            metadata: insight.metadata as any
          }
        })
      )
    )

    return NextResponse.json({ insights, cached: false })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

// POST /api/insights/dismiss - Dismiss an insight
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { insightId } = body

    if (!insightId) {
      return NextResponse.json(
        { error: 'Insight ID required' },
        { status: 400 }
      )
    }

    // Verify ownership and dismiss
    const insight = await db.aIInsight.findFirst({
      where: {
        id: insightId,
        userId: user.id
      }
    })

    if (!insight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 })
    }

    await db.aIInsight.update({
      where: { id: insightId },
      data: { isDismissed: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error dismissing insight:', error)
    return NextResponse.json(
      { error: 'Failed to dismiss insight' },
      { status: 500 }
    )
  }
}
