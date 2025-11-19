"use client"

import { useState } from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { KPIDetailModal } from './kpi-detail-modal'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  description?: string
  breakdown?: {
    label: string
    value: string
    percentage?: number
  }[]
  historicalData?: {
    month: string
    value: string
  }[]
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  isLoading,
  isEmpty,
  emptyMessage,
  description,
  breakdown,
  historicalData,
}: KPICardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => {
    if (!isEmpty && !isLoading) {
      setModalOpen(true)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card className="border-dashed transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 cursor-pointer group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
            <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-muted-foreground group-hover:text-foreground transition-colors">$0.00</div>
          <p className="text-xs text-muted-foreground mt-2 group-hover:text-primary/70 transition-colors">
            {emptyMessage || 'No data yet'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card
        className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 cursor-pointer group"
        onClick={handleClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">{title}</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
            <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}>{value}</div>
          {trend && (
            <p className="text-xs text-muted-foreground mt-1">
              <span
                className={cn(
                  "font-medium",
                  trend.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              {' '}
              {trend.label}
            </p>
          )}
        </CardContent>
      </Card>

      <KPIDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={title}
        value={String(value)}
        change={trend?.value}
        changeLabel={trend?.label}
        icon={Icon}
        description={description}
        breakdown={breakdown}
        historicalData={historicalData}
      />
    </>
  )
}
