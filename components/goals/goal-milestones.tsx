"use client"

import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GoalMilestonesProps {
  currentAmount: number
  targetAmount: number
  className?: string
}

interface Milestone {
  percentage: number
  label: string
  amount: number
  isReached: boolean
}

export function GoalMilestones({ currentAmount, targetAmount, className }: GoalMilestonesProps) {
  const percentComplete = (currentAmount / targetAmount) * 100

  const milestones: Milestone[] = [
    {
      percentage: 25,
      label: 'Quarter',
      amount: targetAmount * 0.25,
      isReached: percentComplete >= 25,
    },
    {
      percentage: 50,
      label: 'Halfway',
      amount: targetAmount * 0.5,
      isReached: percentComplete >= 50,
    },
    {
      percentage: 75,
      label: 'Three-Quarters',
      amount: targetAmount * 0.75,
      isReached: percentComplete >= 75,
    },
    {
      percentage: 100,
      label: 'Complete',
      amount: targetAmount,
      isReached: percentComplete >= 100,
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-semibold text-muted-foreground">Milestones</h4>
      <div className="space-y-2">
        {milestones.map((milestone) => {
          const Icon = milestone.isReached ? CheckCircle2 : Circle
          const isNext = !milestone.isReached && percentComplete < milestone.percentage

          return (
            <div
              key={milestone.percentage}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-colors',
                milestone.isReached && 'bg-green-500/10',
                isNext && 'bg-primary/5 border border-primary/20'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  milestone.isReached ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      milestone.isReached && 'text-green-600 dark:text-green-500',
                      isNext && 'text-primary'
                    )}
                  >
                    {milestone.label} ({milestone.percentage}%)
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(milestone.amount)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
