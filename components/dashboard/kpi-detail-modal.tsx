"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Download, ExternalLink } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface KPIDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon: LucideIcon
  description?: string
  breakdown?: {
    label: string
    value: string
    percentage?: number
  }[]
  historicalData?: {
    month: string
    value: string
  }[]
}

export function KPIDetailModal({
  open,
  onOpenChange,
  title,
  value,
  change,
  changeLabel = 'this month',
  icon: Icon,
  description,
  breakdown,
  historicalData,
}: KPIDetailModalProps) {
  const isPositive = change !== undefined && change >= 0
  const changeColor = isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Main Value Display */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-5xl font-bold tracking-tight mb-3" style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}>
                  {value}
                </div>
                {change !== undefined && (
                  <div className="flex items-center justify-center gap-2">
                    <TrendIcon className={`h-5 w-5 ${changeColor}`} />
                    <span className={`text-lg font-semibold ${changeColor}`}>
                      {isPositive ? '+' : ''}{change.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">{changeLabel}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Breakdown Section */}
          {breakdown && breakdown.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Breakdown</h3>
              <div className="space-y-3">
                {breakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      {item.percentage !== undefined && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.percentage}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-lg font-semibold ml-4" style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Data */}
          {historicalData && historicalData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Last 6 Months</h3>
              <div className="grid grid-cols-3 gap-3">
                {historicalData.map((item, index) => (
                  <Card
                    key={index}
                    className="hover:border-primary/50 transition-colors"
                  >
                    <CardContent className="pt-4 text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        {item.month}
                      </div>
                      <div className="text-lg font-semibold" style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}>
                        {item.value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1" variant="default">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
            <Button className="flex-1" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
