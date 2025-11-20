"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart, registerables } from 'chart.js'
import { TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

if (typeof window !== 'undefined') {
  Chart.register(...registerables)
}

interface NetWorthData {
  month: string
  assets: number
  liabilities: number
  netWorth: number
}

export function NetWorthChart() {
  const [data, setData] = useState<NetWorthData[]>([])
  const [loading, setLoading] = useState(true)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    fetchNetWorthData()
  }, [])

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

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
            label: 'Assets',
            data: data.map(d => d.assets),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Liabilities',
            data: data.map(d => d.liabilities),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Net Worth',
            data: data.map(d => d.netWorth),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
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

  const fetchNetWorthData = async () => {
    try {
      const response = await fetch('/api/analytics/net-worth')
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching net worth data:', error)
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
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const currentNetWorth = data.length > 0 ? data[data.length - 1].netWorth : 0
  const previousNetWorth = data.length > 1 ? data[data.length - 2].netWorth : currentNetWorth
  const netWorthChange = currentNetWorth - previousNetWorth
  const netWorthChangePercent = previousNetWorth !== 0
    ? ((netWorthChange / Math.abs(previousNetWorth)) * 100).toFixed(1)
    : '0'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Net Worth Tracking
        </CardTitle>
        <CardDescription>
          Your total net worth over time (last 6 months)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Net Worth Summary */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
            <div>
              <p className="text-sm text-muted-foreground">Current Net Worth</p>
              <p className="text-2xl font-bold">{formatCurrency(currentNetWorth)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Change</p>
              <p className={`text-lg font-semibold ${netWorthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netWorthChange >= 0 ? '+' : ''}{formatCurrency(netWorthChange)}
                <span className="text-sm ml-1">({netWorthChangePercent}%)</span>
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[250px] relative">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
