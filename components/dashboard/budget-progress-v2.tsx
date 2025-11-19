"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PiggyBank, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface BudgetCategory {
  id: string
  budgetId: string
  categoryId: string
  budgeted: number
  spent: number
  alertThreshold: number
  category: {
    id: string
    name: string
    icon?: string
  }
}

interface Budget {
  id: string
  name: string
  periodType: string
  startDate: string
  endDate: string
  budgetCategories: BudgetCategory[]
}

interface BudgetProgressV2Props {
  isEmpty?: boolean
  isLoading?: boolean
}

export function BudgetProgressV2({ isEmpty, isLoading }: BudgetProgressV2Props) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch('/api/budgets?includeStats=true')
        const data = await response.json()
        if (data.success) {
          setBudgets(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching budgets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBudgets()
  }, [])

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-600 dark:bg-red-500'
    if (percentage >= 80) return 'bg-yellow-600 dark:bg-yellow-500'
    return 'bg-green-600 dark:bg-green-500'
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
    if (percentage >= 80) return <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-500" />
  }

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'Food & Dining': '🍔',
      'Housing': '🏠',
      'Transportation': '🚗',
      'Utilities': '⚡',
      'Entertainment': '🎮',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Education': '📚',
      'Insurance': '🛡️',
      'Subscriptions': '📱',
      'Other': '💳',
    }
    return iconMap[categoryName] || '💰'
  }

  if (loading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-56" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isEmpty || budgets.length === 0) {
    return (
      <Card className="border-dashed transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-primary/50 group">
        <CardHeader>
          <CardTitle className="text-muted-foreground group-hover:text-primary transition-colors">
            Budget Progress
          </CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-primary/70 transition-colors">
            Track your spending by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <PiggyBank className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Create budgets to control your spending
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get the most recent budget
  const currentBudget = budgets[0]
  if (!currentBudget) {
    return null
  }

  const totalSpent = currentBudget.budgetCategories.reduce((sum, bc) => sum + bc.spent, 0)
  const totalLimit = currentBudget.budgetCategories.reduce((sum, bc) => sum + bc.budgeted, 0)
  const overallPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-primary" />
              </div>
              Budget Progress
            </CardTitle>
            <CardDescription className="mt-1">
              ${totalSpent.toFixed(2)} of ${totalLimit.toFixed(2)} spent ({overallPercentage.toFixed(0)}%)
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/budgets">
              Manage
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentBudget.budgetCategories.map((bc) => {
          const percentage = bc.budgeted > 0 ? (bc.spent / bc.budgeted) * 100 : 0
          const remaining = bc.budgeted - bc.spent
          const isOverBudget = percentage >= 100

          return (
            <div
              key={bc.id}
              className="p-3 rounded-lg border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/50 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {bc.category.icon || getCategoryIcon(bc.category.name)}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                      {bc.category.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isOverBudget ? (
                        <span className="text-red-600 dark:text-red-500 font-medium">
                          ${Math.abs(remaining).toFixed(2)} over budget
                        </span>
                      ) : (
                        <span>
                          ${remaining.toFixed(2)} remaining
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  {getStatusIcon(percentage)}
                  <div>
                    <div className="text-sm font-bold" style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}>
                      ${bc.spent.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of ${bc.budgeted.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-2"
                  indicatorClassName={getProgressColor(percentage)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}% used
                  </span>
                  {percentage >= 80 && percentage < 100 && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">
                      Approaching limit
                    </span>
                  )}
                  {percentage >= 100 && (
                    <span className="text-xs text-red-600 dark:text-red-500 font-medium">
                      Budget exceeded
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
