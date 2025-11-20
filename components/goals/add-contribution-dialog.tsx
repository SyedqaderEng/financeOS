"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
}

interface AddContributionDialogProps {
  goal: Goal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddContributionDialog({
  goal,
  open,
  onOpenChange,
  onSuccess,
}: AddContributionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (open) {
      setAmount('')
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal) return

    const contributionAmount = parseFloat(amount)
    if (contributionAmount <= 0) {
      toast.error('Contribution amount must be greater than 0')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/goals/${goal.id}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: contributionAmount,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Added ${formatCurrency(contributionAmount)} to ${goal.name}`)
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to add contribution')
      }
    } catch (error) {
      console.error('Error adding contribution:', error)
      toast.error('Failed to add contribution')
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

  if (!goal) return null

  const remaining = goal.targetAmount - goal.currentAmount
  const newTotal = goal.currentAmount + (parseFloat(amount) || 0)
  const newPercentage = (newTotal / goal.targetAmount) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Contribution</DialogTitle>
          <DialogDescription>
            Add money to "{goal.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Progress */}
          <div className="p-4 rounded-lg bg-muted">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Current</p>
                <p className="font-semibold">{formatCurrency(goal.currentAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Target</p>
                <p className="font-semibold">{formatCurrency(goal.targetAmount)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground mb-1">Remaining</p>
                <p className="font-semibold text-amber-600 dark:text-amber-500">
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>
          </div>

          {/* Contribution Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Contribution Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
            />
          </div>

          {/* New Progress Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-2">After contribution:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">New Total</p>
                  <p className="font-semibold text-green-600 dark:text-green-500">
                    {formatCurrency(newTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Progress</p>
                  <p className="font-semibold text-green-600 dark:text-green-500">
                    {Math.min(newPercentage, 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              {newPercentage >= 100 && (
                <p className="text-sm text-green-600 dark:text-green-500 font-semibold mt-2">
                  🎉 Goal will be completed!
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Contribution'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
