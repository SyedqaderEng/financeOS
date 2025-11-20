"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart, registerables } from 'chart.js'
import { BarChart3 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

if (typeof window !== 'undefined') {
  Chart.register(...registerables)
}

interface BudgetData {
  category: string
  budgeted: number
  spent: number
  remaining: number
}

export function BudgetVsActualChart() {
  const [data, setData] = useState<BudgetData[]>([])
  const [loading, setLoading] = useState(true)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    fetchBudgetData()
  }, [])

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.category),
        datasets: [
          {
            label: 'Budgeted',
            data: data.map(d => d.budgeted),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          },
          {
            label: 'Spent',
            data: data.map(d => d.spent),
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += ': $'
                }
                label += context.parsed.y.toLocaleString()

                // Add percentage for spent
                if (context.dataset.label === 'Spent') {
                  const budgeted = data[context.dataIndex].budgeted
                  if (budgeted > 0) {
                    const percentage = ((context.parsed.y / budgeted) * 100).toFixed(1)
                    label += ` (${percentage}%)`
                  }
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

  const fetchBudgetData = async () => {
    try {
      const response = await fetch('/api/analytics/budget-vs-actual')
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Budget vs Actual
          </CardTitle>
          <CardDescription>
            Compare budgeted amounts with actual spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No budget data available. Create budgets to see this chart.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Budget vs Actual
        </CardTitle>
        <CardDescription>
          Compare budgeted amounts with actual spending (current month)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
