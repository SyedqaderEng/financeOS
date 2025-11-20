"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Target,
  X,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Insight {
  type: 'warning' | 'opportunity' | 'tip' | 'alert' | 'recommendation'
  priority: 'low' | 'medium' | 'high'
  title: string
  message: string
  actionLabel?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

const insightIcons = {
  warning: AlertTriangle,
  opportunity: TrendingUp,
  tip: Lightbulb,
  alert: AlertCircle,
  recommendation: Target
}

const insightColors = {
  warning: 'text-warning',
  opportunity: 'text-success',
  tip: 'text-info',
  alert: 'text-destructive',
  recommendation: 'text-primary'
}

const priorityColors = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-muted text-muted-foreground border-border'
}

export function InsightsWidget() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dismissedInsights, setDismissedInsights] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async (fresh = false) => {
    try {
      setLoading(!fresh)
      setRefreshing(fresh)

      const url = fresh ? '/api/insights?fresh=true' : '/api/insights'
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch insights')
      }

      const data = await response.json()
      setInsights(data.insights || [])
    } catch (error) {
      console.error('Error fetching insights:', error)
      toast({
        title: 'Error',
        description: 'Failed to load insights',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchInsights(true)
  }

  const handleDismiss = (index: number) => {
    setDismissedInsights(prev => new Set(prev).add(index))
  }

  const visibleInsights = insights.filter((_, index) => !dismissedInsights.has(index))

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  if (visibleInsights.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Insights</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            No insights available yet. Check back after you've added some transactions and investments.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">AI Insights</h3>
          {insights.length > 0 && (
            <Badge variant="secondary" className="rounded-full">
              {visibleInsights.length}
            </Badge>
          )}
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

      <div className="space-y-3">
        {visibleInsights.slice(0, 5).map((insight, index) => {
          const Icon = insightIcons[insight.type]
          const iconColor = insightColors[insight.type]
          const priorityColor = priorityColors[insight.priority]

          return (
            <div
              key={index}
              className={`relative rounded-lg border p-4 ${priorityColor} transition-all hover:shadow-md`}
            >
              {/* Dismiss Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => handleDismiss(index)}
              >
                <X className="h-3 w-3" />
              </Button>

              {/* Icon & Title */}
              <div className="flex items-start gap-3 mb-2 pr-8">
                <Icon className={`h-5 w-5 mt-0.5 ${iconColor} flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                  </div>
                  <p className="text-sm opacity-90">{insight.message}</p>

                  {/* Action Button */}
                  {insight.actionLabel && insight.actionUrl && (
                    <Link href={insight.actionUrl} className="inline-block mt-3">
                      <Button variant="outline" size="sm" className="h-8">
                        {insight.actionLabel}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {visibleInsights.length > 5 && (
        <Button variant="ghost" className="w-full mt-4" asChild>
          <Link href="/app/insights">
            View All {visibleInsights.length} Insights
          </Link>
        </Button>
      )}
    </Card>
  )
}
