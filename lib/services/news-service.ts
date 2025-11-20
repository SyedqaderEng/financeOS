// RSS News Feed Service
import Parser from 'rss-parser'
import { db } from '@/lib/db'

export interface NewsSource {
  name: string
  url: string
  category: 'market' | 'personal_finance' | 'crypto' | 'stocks'
}

export interface ParsedNewsItem {
  source: string
  title: string
  description: string
  link: string
  category: string
  symbols: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
  publishedAt: Date
}

export class NewsService {
  private parser: Parser
  private sources: NewsSource[] = [
    // Market News
    {
      name: 'Bloomberg Markets',
      url: 'https://feeds.bloomberg.com/markets/news.rss',
      category: 'market'
    },
    {
      name: 'CNBC Top News',
      url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      category: 'market'
    },
    {
      name: 'Reuters Business',
      url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
      category: 'market'
    },
    // Personal Finance
    {
      name: 'NerdWallet',
      url: 'https://www.nerdwallet.com/blog/feed/',
      category: 'personal_finance'
    },
    {
      name: 'The Motley Fool',
      url: 'https://www.fool.com/feeds/fool-rss-feeds.aspx',
      category: 'personal_finance'
    },
    // Crypto
    {
      name: 'CoinTelegraph',
      url: 'https://cointelegraph.com/rss',
      category: 'crypto'
    },
    {
      name: 'CoinDesk',
      url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
      category: 'crypto'
    },
    // Stock Market Specific
    {
      name: 'Yahoo Finance',
      url: 'https://finance.yahoo.com/news/rssindex',
      category: 'stocks'
    },
    {
      name: 'MarketWatch',
      url: 'https://www.marketwatch.com/rss/topstories',
      category: 'stocks'
    }
  ]

  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'FinanceOS/1.0'
      }
    })
  }

  /**
   * Fetch news from all RSS sources
   */
  async fetchAllNews(): Promise<ParsedNewsItem[]> {
    const newsPromises = this.sources.map(source =>
      this.fetchNewsFromSource(source).catch(error => {
        console.error(`Failed to fetch from ${source.name}:`, error)
        return []
      })
    )

    const newsArrays = await Promise.all(newsPromises)
    const allNews = newsArrays.flat()

    // Remove duplicates based on title similarity
    const uniqueNews = this.deduplicateNews(allNews)

    // Sort by published date (newest first)
    return uniqueNews.sort((a, b) =>
      b.publishedAt.getTime() - a.publishedAt.getTime()
    )
  }

  /**
   * Fetch news from a specific source
   */
  private async fetchNewsFromSource(source: NewsSource): Promise<ParsedNewsItem[]> {
    try {
      const feed = await this.parser.parseURL(source.url)

      return (feed.items || []).map(item => ({
        source: source.name,
        title: item.title || 'Untitled',
        description: this.cleanDescription(item.contentSnippet || item.description || ''),
        link: item.link || '',
        category: source.category,
        symbols: this.extractSymbols(item.title || '', item.contentSnippet || ''),
        sentiment: this.analyzeSentiment(item.title || '', item.contentSnippet || ''),
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date()
      }))
    } catch (error) {
      console.error(`Error parsing feed from ${source.name}:`, error)
      return []
    }
  }

  /**
   * Fetch news for a specific category
   */
  async fetchNewsByCategory(category: string): Promise<ParsedNewsItem[]> {
    const categoryNews = await Promise.all(
      this.sources
        .filter(source => source.category === category)
        .map(source => this.fetchNewsFromSource(source))
    )

    return categoryNews
      .flat()
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  }

  /**
   * Get personalized news based on user's portfolio
   */
  async getPersonalizedNews(userId: string, limit: number = 20): Promise<ParsedNewsItem[]> {
    // Get user's investment symbols
    const investments = await db.investment.findMany({
      where: { userId },
      select: { symbol: true }
    })

    const userSymbols = investments.map(inv => inv.symbol.toUpperCase())

    // Fetch all news
    const allNews = await this.fetchAllNews()

    // Prioritize news mentioning user's holdings
    const personalizedNews = allNews.map(news => {
      const hasUserSymbol = news.symbols.some(symbol =>
        userSymbols.includes(symbol.toUpperCase())
      )
      return {
        ...news,
        priority: hasUserSymbol ? 1 : 0
      }
    })

    // Sort by priority (user symbols first), then by date
    return personalizedNews
      .sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority
        return b.publishedAt.getTime() - a.publishedAt.getTime()
      })
      .slice(0, limit)
  }

  /**
   * Store news items in database
   */
  async storeNewsItems(newsItems: ParsedNewsItem[]): Promise<number> {
    let storedCount = 0

    for (const item of newsItems) {
      try {
        // Check if article already exists
        const existing = await db.newsItem.findFirst({
          where: {
            link: item.link
          }
        })

        if (!existing) {
          await db.newsItem.create({
            data: {
              source: item.source,
              title: item.title,
              description: item.description,
              link: item.link,
              category: item.category,
              symbols: item.symbols,
              sentiment: item.sentiment,
              publishedAt: item.publishedAt
            }
          })
          storedCount++
        }
      } catch (error) {
        console.error('Error storing news item:', error)
      }
    }

    return storedCount
  }

  /**
   * Get news from database
   */
  async getStoredNews(
    category?: string,
    limit: number = 50,
    offset: number = 0
  ) {
    return await db.newsItem.findMany({
      where: category ? { category } : undefined,
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: offset
    })
  }

  /**
   * Extract stock symbols from text (simple pattern matching)
   */
  private extractSymbols(title: string, content: string): string[] {
    const text = `${title} ${content}`.toUpperCase()
    const symbols: Set<string> = new Set()

    // Common patterns for stock mentions
    // Pattern 1: Ticker in parentheses like "Apple (AAPL)"
    const parenthesesPattern = /\(([A-Z]{1,5})\)/g
    let match
    while ((match = parenthesesPattern.exec(text)) !== null) {
      symbols.add(match[1])
    }

    // Pattern 2: Direct ticker mentions for popular stocks
    const popularStocks = [
      'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD',
      'NFLX', 'DIS', 'PYPL', 'SQ', 'SHOP', 'UBER', 'LYFT', 'COIN',
      'BTC', 'ETH', 'SPY', 'QQQ', 'VTI', 'VOO'
    ]

    popularStocks.forEach(symbol => {
      const regex = new RegExp(`\\b${symbol}\\b`, 'g')
      if (regex.test(text)) {
        symbols.add(symbol)
      }
    })

    // Pattern 3: Crypto mentions
    const cryptoMentions: Record<string, string> = {
      'BITCOIN': 'BTC',
      'ETHEREUM': 'ETH',
      'DOGECOIN': 'DOGE',
      'CARDANO': 'ADA',
      'SOLANA': 'SOL'
    }

    Object.entries(cryptoMentions).forEach(([name, symbol]) => {
      if (text.includes(name)) {
        symbols.add(symbol)
      }
    })

    return Array.from(symbols)
  }

  /**
   * Simple sentiment analysis
   */
  private analyzeSentiment(title: string, content: string): 'positive' | 'negative' | 'neutral' {
    const text = `${title} ${content}`.toLowerCase()

    const positiveWords = [
      'surge', 'soar', 'rally', 'gain', 'profit', 'growth', 'record', 'high',
      'beat', 'exceed', 'strong', 'bullish', 'breakthrough', 'success', 'win',
      'advance', 'climb', 'jump', 'boost', 'optimistic', 'upgrade'
    ]

    const negativeWords = [
      'crash', 'plunge', 'fall', 'loss', 'drop', 'decline', 'weak', 'bearish',
      'miss', 'fail', 'concern', 'worry', 'risk', 'threat', 'warning', 'cut',
      'downgrade', 'struggle', 'tumble', 'sink', 'slump', 'fear', 'layoff'
    ]

    let positiveCount = 0
    let negativeCount = 0

    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++
    })

    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++
    })

    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  /**
   * Clean HTML and excess whitespace from description
   */
  private cleanDescription(description: string): string {
    return description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 300) // Limit length
  }

  /**
   * Remove duplicate news items based on title similarity
   */
  private deduplicateNews(newsItems: ParsedNewsItem[]): ParsedNewsItem[] {
    const seen = new Set<string>()
    const unique: ParsedNewsItem[] = []

    for (const item of newsItems) {
      // Create a normalized title for comparison
      const normalizedTitle = item.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .slice(0, 50)

      if (!seen.has(normalizedTitle)) {
        seen.add(normalizedTitle)
        unique.push(item)
      }
    }

    return unique
  }

  /**
   * Background job to refresh news periodically
   */
  async refreshNews(): Promise<{ fetched: number; stored: number }> {
    console.log('Starting news refresh...')

    const newsItems = await this.fetchAllNews()
    const stored = await this.storeNewsItems(newsItems)

    console.log(`Refreshed ${newsItems.length} news items, stored ${stored} new ones`)

    return {
      fetched: newsItems.length,
      stored
    }
  }

  /**
   * Clean up old news items (older than 30 days)
   */
  async cleanupOldNews(): Promise<number> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await db.newsItem.deleteMany({
      where: {
        publishedAt: {
          lt: thirtyDaysAgo
        }
      }
    })

    console.log(`Cleaned up ${result.count} old news items`)
    return result.count
  }
}

// Singleton instance
export const newsService = new NewsService()
