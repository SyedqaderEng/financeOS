"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface CategoryData {
  category: string
  amount: number
  percentage: number
  trend: number // positive = increasing, negative = decreasing
  transactionCount: number
}

export function TopSpendingCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopCategories()
  }, [])

  const fetchTopCategories = async () => {
    try {
      const response = await fetch('/api/analytics/top-categories')
      const result = await response.json()

      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Error fetching top categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5" />
          Top Spending Categories
        </CardTitle>
        <CardDescription>
          Your highest expense categories (last 30 days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No spending data available
            </div>
          ) : (
            categories.map((category, index) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{category.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(category.amount)}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {category.trend > 0 ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-red-600" />
                          <span className="text-red-600">+{category.trend}%</span>
                        </>
                      ) : category.trend < 0 ? (
                        <>
                          <TrendingDown className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">{category.trend}%</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">No change</span>
                      )}
                    </div>
                  </div>
                </div>
                <Progress
                  value={category.percentage}
                  className="h-2"
                  indicatorClassName={index === 0 ? 'bg-red-500' : index === 1 ? 'bg-amber-500' : 'bg-blue-500'}
                />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
