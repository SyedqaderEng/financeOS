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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
}

interface EditGoalDialogProps {
  goal: Goal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const GOAL_CATEGORIES = [
  'Emergency Fund',
  'Vacation',
  'Home Purchase',
  'Car Purchase',
  'Debt Payoff',
  'Retirement',
  'Education',
  'Investment',
  'Other',
]

export function EditGoalDialog({
  goal,
  open,
  onOpenChange,
  onSuccess,
}: EditGoalDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    targetAmount: '',
    targetDate: '',
  })

  useEffect(() => {
    if (goal && open) {
      setFormData({
        name: goal.name,
        category: goal.category,
        targetAmount: goal.targetAmount.toString(),
        targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      })
    }
  }, [goal, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal) return

    setLoading(true)

    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          targetAmount: parseFloat(formData.targetAmount),
          targetDate: formData.targetDate,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Goal updated successfully')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to update goal')
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error('Failed to update goal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update the goal details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Emergency Fund"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
              }
              required
            />
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-600 dark:text-blue-500">
              <strong>Note:</strong> Editing will not affect your current savings amount for this goal.
            </p>
          </div>

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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
