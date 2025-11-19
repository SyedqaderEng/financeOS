"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const EXPENSE_CATEGORIES = [
  { value: 'housing', label: 'Housing', icon: '🏠' },
  { value: 'food', label: 'Food & Dining', icon: '🍔' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'utilities', label: 'Utilities', icon: '⚡' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️' },
  { value: 'subscription', label: 'Subscriptions', icon: '📱' },
  { value: 'other', label: 'Other', icon: '💳' },
]

interface BudgetCategory {
  categoryName: string
  budgetedAmount: string
  alertThreshold: string
}

interface AddBudgetFormProps {
  onSuccess?: () => void
}

export function AddBudgetForm({ onSuccess }: AddBudgetFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    periodType: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  })

  const [categories, setCategories] = useState<BudgetCategory[]>([
    { categoryName: '', budgetedAmount: '', alertThreshold: '90' },
  ])

  const handleAddCategory = () => {
    setCategories([...categories, { categoryName: '', budgetedAmount: '', alertThreshold: '90' }])
  }

  const handleRemoveCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index))
    }
  }

  const handleCategoryChange = (index: number, field: keyof BudgetCategory, value: string) => {
    const updated = [...categories]
    if (updated[index]) {
      updated[index][field] = value
      setCategories(updated)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const validCategories = categories.filter(c => c.categoryName && c.budgetedAmount)

    if (validCategories.length === 0) {
      toast.error('Please add at least one budget category')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          periodType: formData.periodType,
          startDate: new Date(formData.startDate || new Date().toISOString()),
          endDate: new Date(formData.endDate || new Date().toISOString()),
          categories: validCategories.map(c => ({
            categoryName: c.categoryName,
            budgetedAmount: parseFloat(c.budgetedAmount),
            alertThreshold: parseInt(c.alertThreshold),
          })),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to create budget')
      }

      toast.success('Budget created successfully!')
      router.refresh()
      onSuccess?.()

      // Reset form
      setFormData({
        name: '',
        periodType: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      })
      setCategories([{ categoryName: '', budgetedAmount: '', alertThreshold: '90' }])
      setOpen(false)
    } catch (error) {
      console.error('Error creating budget:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create budget')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Set spending limits for different categories to track your budget
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name</Label>
            <Input
              id="name"
              placeholder="e.g., December 2025 Budget"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodType">Period Type</Label>
              <Select
                value={formData.periodType}
                onValueChange={(value) => setFormData({ ...formData, periodType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Budget Categories</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCategory}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            {categories.map((category, index) => (
              <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Select
                    value={category.categoryName}
                    onValueChange={(value) => handleCategoryChange(index, 'categoryName', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.label}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="number"
                        placeholder="Budget amount"
                        value={category.budgetedAmount}
                        onChange={(e) => handleCategoryChange(index, 'budgetedAmount', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Alert at %"
                        value={category.alertThreshold}
                        onChange={(e) => handleCategoryChange(index, 'alertThreshold', e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                {categories.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCategory(index)}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Budget'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
