"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
if (typeof window !== 'undefined') {
  Chart.register(...registerables)
}

interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

type TimePeriod = '7D' | '1M' | '3M' | '1Y' | 'All'

interface CashFlowChartV2Props {
  isLoading?: boolean
  isEmpty?: boolean
}

export function CashFlowChartV2({ isLoading, isEmpty }: CashFlowChartV2Props) {
  const [data, setData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('3M')
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    const fetchCashFlowData = async () => {
      try {
        // Fetch transactions
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

          // Convert to array based on time period
          const now = new Date()
          const months: MonthlyData[] = []

          // Determine how many months to show based on time period
          let monthsToShow = 3 // default for 3M
          switch (timePeriod) {
            case '7D':
            case '1M':
              monthsToShow = 1
              break
            case '3M':
              monthsToShow = 3
              break
            case '1Y':
              monthsToShow = 12
              break
            case 'All':
              monthsToShow = 24 // Show up to 2 years
              break
          }

          for (let i = monthsToShow - 1; i >= 0; i--) {
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
  }, [timePeriod])

  // Chart.js rendering
  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    // Destroy previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.month),
        datasets: [
          {
            label: 'Income',
            data: data.map(d => d.income),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Expenses',
            data: data.map(d => d.expenses),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              boxWidth: 8,
              boxHeight: 8,
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += '$' + context.parsed.y.toLocaleString()
                }
                return label
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString()
              },
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [data])

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Cash Flow Analysis
            </CardTitle>
            <CardDescription>Your income and expenses over time</CardDescription>
          </div>
          <div className="flex gap-2">
            {(['7D', '1M', '3M', '1Y', 'All'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  timePeriod === period
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
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

        {/* Chart */}
        <div className="w-full h-[300px] relative">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
