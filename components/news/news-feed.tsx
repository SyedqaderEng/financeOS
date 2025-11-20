"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Newspaper,
  TrendingUp,
  DollarSign,
  Bitcoin,
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NewsItem {
  source: string
  title: string
  description: string
  link: string
  category: string
  symbols: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
  publishedAt: string
}

const categoryIcons = {
  market: TrendingUp,
  personal_finance: DollarSign,
  crypto: Bitcoin,
  stocks: Newspaper
}

const sentimentColors = {
  positive: 'bg-success/10 text-success border-success/20',
  negative: 'bg-destructive/10 text-destructive border-destructive/20',
  neutral: 'bg-muted text-muted-foreground border-border'
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchNews()
  }, [activeCategory])

  const fetchNews = async (fresh = false) => {
    try {
      setLoading(!fresh)
      setRefreshing(fresh)

      const params = new URLSearchParams()
      if (activeCategory !== 'all') {
        params.append('category', activeCategory)
      }
      if (fresh) {
        params.append('fresh', 'true')
      }
      params.append('limit', '20')

      const response = await fetch(`/api/news?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()
      setNews(data.news || [])
    } catch (error) {
      console.error('Error fetching news:', error)
      toast({
        title: 'Error',
        description: 'Failed to load news feed',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchNews(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Financial News</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="personal_finance">Finance</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          {news.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No news available</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
              {news.map((item, index) => {
                const CategoryIcon = categoryIcons[item.category as keyof typeof categoryIcons] || Newspaper
                const sentimentColor = item.sentiment ? sentimentColors[item.sentiment] : sentimentColors.neutral

                return (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="rounded-lg border p-4 hover:shadow-md transition-all hover:border-primary/50">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <CategoryIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{item.source}</span>
                          {item.sentiment && (
                            <Badge variant="outline" className={`text-xs ${sentimentColor}`}>
                              {item.sentiment}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.publishedAt)}
                          </span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {item.description}
                      </p>

                      {/* Symbols */}
                      {item.symbols && item.symbols.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.symbols.slice(0, 5).map((symbol, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs font-mono"
                            >
                              {symbol}
                            </Badge>
                          ))}
                          {item.symbols.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.symbols.length - 5}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
