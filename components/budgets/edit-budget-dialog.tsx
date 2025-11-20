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

interface Budget {
  id: string
  name: string
  category: string
  amount: number
  period: string
  alertThreshold: number
}

interface EditBudgetDialogProps {
  budget: Budget | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food & Dining',
  'Groceries',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Travel',
  'Education',
  'Insurance',
  'Subscriptions',
  'Personal Care',
  'Other Expense',
]

const BUDGET_PERIODS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

export function EditBudgetDialog({
  budget,
  open,
  onOpenChange,
  onSuccess,
}: EditBudgetDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'monthly',
    alertThreshold: '90',
  })

  useEffect(() => {
    if (budget && open) {
      setFormData({
        name: budget.name,
        category: budget.category,
        amount: budget.amount.toString(),
        period: budget.period,
        alertThreshold: budget.alertThreshold.toString(),
      })
    }
  }, [budget, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!budget) return

    setLoading(true)

    try {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          amount: parseFloat(formData.amount),
          period: formData.period,
          alertThreshold: parseInt(formData.alertThreshold),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Budget updated successfully')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to update budget')
      }
    } catch (error) {
      console.error('Error updating budget:', error)
      toast.error('Failed to update budget')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>
            Update the budget details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Monthly Groceries"
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
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={formData.period}
                onValueChange={(value) =>
                  setFormData({ ...formData, period: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_PERIODS.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
              <Input
                id="alertThreshold"
                type="number"
                min="1"
                max="100"
                value={formData.alertThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, alertThreshold: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-600 dark:text-blue-500">
              <strong>Note:</strong> The alert threshold is the percentage at which you'll be warned about approaching your budget limit.
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
