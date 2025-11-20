import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { newsService } from '@/lib/services/news-service'

// GET /api/news - Get news feed
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
    const category = searchParams.get('category')
    const personalized = searchParams.get('personalized') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const fresh = searchParams.get('fresh') === 'true'

    // If fresh news requested, fetch directly from RSS
    if (fresh) {
      if (personalized) {
        const news = await newsService.getPersonalizedNews(user.id, limit)
        return NextResponse.json({ news, source: 'rss' })
      } else if (category) {
        const news = await newsService.fetchNewsByCategory(category)
        return NextResponse.json({ news: news.slice(0, limit), source: 'rss' })
      } else {
        const news = await newsService.fetchAllNews()
        return NextResponse.json({ news: news.slice(0, limit), source: 'rss' })
      }
    }

    // Otherwise, fetch from database
    const storedNews = await newsService.getStoredNews(
      category || undefined,
      limit,
      0
    )

    // If database is empty or stale, fetch fresh and store
    if (storedNews.length === 0) {
      const freshNews = category
        ? await newsService.fetchNewsByCategory(category)
        : await newsService.fetchAllNews()

      await newsService.storeNewsItems(freshNews.slice(0, limit))

      return NextResponse.json({
        news: freshNews.slice(0, limit),
        source: 'rss-cached'
      })
    }

    return NextResponse.json({
      news: storedNews,
      source: 'database'
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

// POST /api/news/refresh - Manually trigger news refresh
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await newsService.refreshNews()

    return NextResponse.json({
      success: true,
      fetched: result.fetched,
      stored: result.stored
    })
  } catch (error) {
    console.error('Error refreshing news:', error)
    return NextResponse.json(
      { error: 'Failed to refresh news' },
      { status: 500 }
    )
  }
}
