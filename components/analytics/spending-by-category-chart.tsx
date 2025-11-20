"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart, registerables } from 'chart.js'
import { PieChart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

if (typeof window !== 'undefined') {
  Chart.register(...registerables)
}

interface CategorySpending {
  category: string
  amount: number
  percentage: number
}

export function SpendingByCategoryChart() {
  const [data, setData] = useState<CategorySpending[]>([])
  const [loading, setLoading] = useState(true)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    fetchCategorySpending()
  }, [])

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    const colors = [
      'rgba(239, 68, 68, 0.8)',   // Red
      'rgba(251, 146, 60, 0.8)',   // Orange
      'rgba(250, 204, 21, 0.8)',   // Yellow
      'rgba(34, 197, 94, 0.8)',    // Green
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(168, 85, 247, 0.8)',   // Purple
      'rgba(236, 72, 153, 0.8)',   // Pink
      'rgba(107, 114, 128, 0.8)',  // Gray
    ]

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.category),
        datasets: [
          {
            data: data.map(d => d.amount),
            backgroundColor: colors.slice(0, data.length),
            borderColor: colors.slice(0, data.length).map(c => c.replace('0.8', '1')),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || ''
                const value = context.parsed || 0
                const percentage = data[context.dataIndex]?.percentage || 0
                return `${label}: $${value.toLocaleString()} (${percentage.toFixed(1)}%)`
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

  const fetchCategorySpending = async () => {
    try {
      const response = await fetch('/api/analytics/spending-by-category')
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching category spending:', error)
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
          <PieChart className="h-5 w-5" />
          Spending by Category
        </CardTitle>
        <CardDescription>
          Breakdown of your expenses by category (last 30 days)
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
