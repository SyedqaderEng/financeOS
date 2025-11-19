"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp } from 'lucide-react'

interface CashFlowChartProps {
  isLoading?: boolean
  isEmpty?: boolean
}

export function CashFlowChart({ isLoading, isEmpty }: CashFlowChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card className="border-dashed transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-primary/50 group">
        <CardHeader>
          <CardTitle className="text-muted-foreground group-hover:text-primary transition-colors">Cash Flow</CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-primary/70 transition-colors">
            Your income and expenses over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:shadow-lg group-hover:shadow-primary/30">
              <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2 group-hover:text-foreground transition-colors">
              No cash flow data yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm group-hover:text-primary/70 transition-colors">
              Start by adding accounts and transactions to see your cash flow visualization.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Actual chart will be implemented in future when we have data
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Your income and expenses over time</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Chart.js implementation will go here */}
        <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground">Chart will render here</p>
        </div>
      </CardContent>
    </Card>
  )
}
