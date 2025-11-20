"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart, registerables } from 'chart.js'
import { TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

if (typeof window !== 'undefined') {
  Chart.register(...registerables)
}

interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

export function MonthlyTrendsChart() {
  const [data, setData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    fetchMonthlyTrends()
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
        labels: data.map(d => d.month),
        datasets: [
          {
            label: 'Income',
            data: data.map(d => d.income),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
          {
            label: 'Expenses',
            data: data.map(d => d.expenses),
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
          },
          {
            label: 'Net',
            data: data.map(d => d.net),
            type: 'line',
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
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

  const fetchMonthlyTrends = async () => {
    try {
      const response = await fetch('/api/analytics/monthly-trends')
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching monthly trends:', error)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Trends
        </CardTitle>
        <CardDescription>
          Income, expenses, and net savings over the last 6 months
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
