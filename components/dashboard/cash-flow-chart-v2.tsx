"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

interface CashFlowChartV2Props {
  isLoading?: boolean
  isEmpty?: boolean
}

export function CashFlowChartV2({ isLoading, isEmpty }: CashFlowChartV2Props) {
  const [data, setData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCashFlowData = async () => {
      try {
        // Fetch transactions for the last 6 months
        const response = await fetch('/api/transactions?limit=1000')
        const result = await response.json()

        if (result.success && result.data) {
          const transactions = result.data

          // Group by month
          const monthlyMap: { [key: string]: { income: number; expenses: number } } = {}

          transactions.forEach((t: any) => {
            const date = new Date(t.date)
            const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })

            if (!monthlyMap[monthKey]) {
              monthlyMap[monthKey] = { income: 0, expenses: 0 }
            }

            if (t.transactionType === 'income') {
              monthlyMap[monthKey].income += parseFloat(t.amount.toString())
            } else if (t.transactionType === 'expense') {
              monthlyMap[monthKey].expenses += parseFloat(t.amount.toString())
            }
          })

          // Convert to array and sort by date (last 6 months)
          const now = new Date()
          const months: MonthlyData[] = []

          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
            const monthData = monthlyMap[monthKey] || { income: 0, expenses: 0 }

            months.push({
              month: monthKey,
              income: monthData.income,
              expenses: monthData.expenses,
              net: monthData.income - monthData.expenses,
            })
          }

          setData(months)
        }
      } catch (error) {
        console.error('Error fetching cash flow data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCashFlowData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading || isLoading) {
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

  if (isEmpty || data.every(m => m.income === 0 && m.expenses === 0)) {
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

  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(m => Math.max(m.income, m.expenses)), 1)

  // Calculate totals
  const totalIncome = data.reduce((sum, m) => sum + m.income, 0)
  const totalExpenses = data.reduce((sum, m) => sum + m.expenses, 0)
  const netCashFlow = totalIncome - totalExpenses

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Cash Flow
        </CardTitle>
        <CardDescription>Your income and expenses over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-green-500/10 dark:bg-green-500/20 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-500 mb-1">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-xs font-medium">Income</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalIncome)}</p>
          </div>

          <div className="p-3 rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-500 mb-1">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-xs font-medium">Expenses</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
          </div>

          <div className={`p-3 rounded-lg border ${
            netCashFlow >= 0
              ? 'bg-primary/10 border-primary/20'
              : 'bg-red-500/10 dark:bg-red-500/20 border-red-500/20'
          }`}>
            <div className={`flex items-center gap-2 mb-1 ${
              netCashFlow >= 0
                ? 'text-primary'
                : 'text-red-600 dark:text-red-500'
            }`}>
              {netCashFlow >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-xs font-medium">Net</span>
            </div>
            <p className="text-lg font-bold">
              {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-3">
          {data.map((month, index) => {
            const netAmount = month.income - month.expenses
            const isPositive = netAmount >= 0

            return (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground w-20">{month.month}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">{formatCurrency(month.income)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">{formatCurrency(month.expenses)}</span>
                    </div>
                    <span className={`font-semibold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                      {isPositive ? '+' : ''}{formatCurrency(netAmount)}
                    </span>
                  </div>
                </div>

                <div className="relative h-10">
                  {/* Income bar */}
                  <div className="absolute left-0 top-0 h-4 bg-green-500/80 hover:bg-green-500 rounded transition-all duration-300 flex items-center justify-start px-2"
                    style={{ width: `${Math.max((month.income / maxValue) * 100, 1)}%` }}>
                    {month.income > 0 && (
                      <span className="text-[10px] text-white font-medium">Income</span>
                    )}
                  </div>

                  {/* Expenses bar */}
                  <div className="absolute left-0 bottom-0 h-4 bg-red-500/80 hover:bg-red-500 rounded transition-all duration-300 flex items-center justify-start px-2"
                    style={{ width: `${Math.max((month.expenses / maxValue) * 100, 1)}%` }}>
                    {month.expenses > 0 && (
                      <span className="text-[10px] text-white font-medium">Expense</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-gradient-to-r from-green-500 to-green-600" />
            <span className="text-xs text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-gradient-to-r from-red-500 to-red-600" />
            <span className="text-xs text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
