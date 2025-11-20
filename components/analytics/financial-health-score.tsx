"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface HealthMetrics {
  score: number
  savingsRate: number
  debtToIncomeRatio: number
  emergencyFundMonths: number
  budgetAdherence: number
}

export function FinancialHealthScore() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHealthMetrics()
  }, [])

  const fetchHealthMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/health-score')
      const result = await response.json()

      if (result.success) {
        setMetrics(result.data)
      }
    } catch (error) {
      console.error('Error fetching health metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-500'
    if (score >= 60) return 'text-amber-600 dark:text-amber-500'
    return 'text-red-600 dark:text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return null
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Financial Health Score
        </CardTitle>
        <CardDescription>
          Your overall financial health based on savings, spending, and debt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="text-center space-y-2">
            <div className={`text-6xl font-bold ${getScoreColor(metrics.score)}`}>
              {metrics.score}
            </div>
            <div className="text-lg font-semibold text-muted-foreground">
              {getScoreLabel(metrics.score)}
            </div>
            <Progress
              value={metrics.score}
              className="h-3"
              indicatorClassName={getProgressColor(metrics.score)}
            />
          </div>

          {/* Metrics Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Savings Rate</p>
              <p className="text-2xl font-bold">{metrics.savingsRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Budget Adherence</p>
              <p className="text-2xl font-bold">{metrics.budgetAdherence}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Emergency Fund</p>
              <p className="text-2xl font-bold">{metrics.emergencyFundMonths.toFixed(1)} mo</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Debt Ratio</p>
              <p className="text-2xl font-bold">{metrics.debtToIncomeRatio}%</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Recommendations
            </h4>
            <div className="space-y-2">
              {metrics.savingsRate < 20 && (
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-muted-foreground">
                    Try to save at least 20% of your income each month
                  </p>
                </div>
              )}
              {metrics.emergencyFundMonths < 3 && (
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-muted-foreground">
                    Build an emergency fund covering 3-6 months of expenses
                  </p>
                </div>
              )}
              {metrics.debtToIncomeRatio > 36 && (
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="text-muted-foreground">
                    Your debt-to-income ratio is high. Consider paying down debts
                  </p>
                </div>
              )}
              {metrics.score >= 80 && (
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-muted-foreground">
                    Great job! Keep maintaining your healthy financial habits
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
