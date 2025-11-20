"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { History, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface Goal {
  id: string
  name: string
}

interface Contribution {
  id: string
  amount: number
  contributionDate: string
  notes: string | null
  createdAt: string
  runningTotal: number
}

interface ContributionHistoryDialogProps {
  goal: Goal
}

export function ContributionHistoryDialog({ goal }: ContributionHistoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchContributions()
    }
  }, [open])

  const fetchContributions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/goals/${goal.id}/contributions`)
      const result = await response.json()

      if (result.success) {
        setContributions(result.data)
      } else {
        toast.error('Failed to load contribution history')
      }
    } catch (error) {
      console.error('Error fetching contributions:', error)
      toast.error('Failed to load contribution history')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const totalContributed = contributions.reduce(
    (sum, c) => sum + parseFloat(c.amount.toString()),
    0
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <History className="h-4 w-4 mr-2" />
          View History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contribution History</DialogTitle>
          <DialogDescription>
            All contributions to "{goal.name}"
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading contributions...</p>
          </div>
        ) : contributions.length === 0 ? (
          <div className="py-8 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No contributions yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start adding contributions to track your progress
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Contributed</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(totalContributed)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Contributions</p>
                  <p className="text-2xl font-bold">{contributions.length}</p>
                </div>
              </div>
            </div>

            {/* Contributions List */}
            <div className="space-y-3">
              {contributions.map((contribution, index) => (
                <div
                  key={contribution.id}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(contribution.contributionDate)}
                        </span>
                      </div>
                      {contribution.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {contribution.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-semibold text-green-600 dark:text-green-500">
                        +{formatCurrency(parseFloat(contribution.amount.toString()))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total: {formatCurrency(contribution.runningTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
