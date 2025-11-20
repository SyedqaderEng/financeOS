"use client"

import { useState } from 'react'
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
import { Plus, X } from 'lucide-react'

interface AddBudgetDialogProps {
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

interface CategoryBudget {
  categoryName: string
  budgetedAmount: string
  alertThreshold: string
}

export function AddBudgetDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddBudgetDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    periodType: 'monthly',
    startDate: '',
    endDate: '',
  })
  const [categories, setCategories] = useState<CategoryBudget[]>([
    {
      categoryName: '',
      budgetedAmount: '',
      alertThreshold: '90',
    }
  ])

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        categoryName: '',
        budgetedAmount: '',
        alertThreshold: '90',
      }
    ])
  }

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index))
    }
  }

  const updateCategory = (index: number, field: keyof CategoryBudget, value: string) => {
    const updated = [...categories]
    updated[index] = { ...updated[index], [field]: value }
    setCategories(updated)
  }

  const calculateEndDate = (startDate: string, periodType: string) => {
    if (!startDate) return ''
    const start = new Date(startDate)
    let end = new Date(start)

    switch (periodType) {
      case 'weekly':
        end.setDate(start.getDate() + 7)
        break
      case 'monthly':
        end.setMonth(start.getMonth() + 1)
        break
      case 'quarterly':
        end.setMonth(start.getMonth() + 3)
        break
      case 'yearly':
        end.setFullYear(start.getFullYear() + 1)
        break
    }

    end.setDate(end.getDate() - 1) // Last day of period
    return end.toISOString().split('T')[0]
  }

  const handleStartDateChange = (date: string) => {
    setFormData({
      ...formData,
      startDate: date,
      endDate: calculateEndDate(date, formData.periodType),
    })
  }

  const handlePeriodTypeChange = (period: string) => {
    setFormData({
      ...formData,
      periodType: period,
      endDate: formData.startDate ? calculateEndDate(formData.startDate, period) : '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate at least one category
    const validCategories = categories.filter(cat => cat.categoryName && cat.budgetedAmount)
    if (validCategories.length === 0) {
      toast.error('Please add at least one category with an amount')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          periodType: formData.periodType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          categories: validCategories.map(cat => ({
            categoryId: '', // Will be created or fetched by API
            categoryName: cat.categoryName,
            budgetedAmount: parseFloat(cat.budgetedAmount),
            alertThreshold: parseInt(cat.alertThreshold),
          })),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Budget created successfully')
        onSuccess()
        onOpenChange(false)
        // Reset form
        setFormData({
          name: '',
          periodType: 'monthly',
          startDate: '',
          endDate: '',
        })
        setCategories([{
          categoryName: '',
          budgetedAmount: '',
          alertThreshold: '90',
        }])
      } else {
        toast.error(result.error?.message || 'Failed to create budget')
      }
    } catch (error) {
      console.error('Error creating budget:', error)
      toast.error('Failed to create budget')
    } finally {
      setLoading(false)
    }
  }

  // Set default start date to today if not set
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Set spending limits for categories to track your expenses
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
              placeholder="e.g., Monthly Budget - January 2025"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodType">Period</Label>
              <Select
                value={formData.periodType}
                onValueChange={handlePeriodTypeChange}
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

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={today}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Categories</Label>
              <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                <Plus className="h-4 w-4 mr-1" />
                Add Category
              </Button>
            </div>

            {categories.map((category, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                <div className="col-span-5 space-y-2">
                  <Label htmlFor={`category-${index}`} className="text-xs">Category</Label>
                  <Select
                    value={category.categoryName}
                    onValueChange={(value) => updateCategory(index, 'categoryName', value)}
                  >
                    <SelectTrigger id={`category-${index}`}>
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

                <div className="col-span-3 space-y-2">
                  <Label htmlFor={`amount-${index}`} className="text-xs">Amount</Label>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={category.budgetedAmount}
                    onChange={(e) => updateCategory(index, 'budgetedAmount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-3 space-y-2">
                  <Label htmlFor={`threshold-${index}`} className="text-xs">Alert %</Label>
                  <Input
                    id={`threshold-${index}`}
                    type="number"
                    min="1"
                    max="100"
                    value={category.alertThreshold}
                    onChange={(e) => updateCategory(index, 'alertThreshold', e.target.value)}
                  />
                </div>

                <div className="col-span-1">
                  {categories.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-600 dark:text-blue-500">
              <strong>Tip:</strong> Set alert thresholds to get notified when you've spent a certain percentage of your budget.
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
              {loading ? 'Creating...' : 'Create Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
