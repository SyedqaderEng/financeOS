"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MinusCircle, Loader2, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const EXPENSE_CATEGORIES = [
  { value: 'Housing', label: 'Housing', icon: '🏠' },
  { value: 'Food & Dining', label: 'Food & Dining', icon: '🍔' },
  { value: 'Transportation', label: 'Transportation', icon: '🚗' },
  { value: 'Utilities', label: 'Utilities', icon: '⚡' },
  { value: 'Entertainment', label: 'Entertainment', icon: '🎮' },
  { value: 'Healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'Education', label: 'Education', icon: '📚' },
  { value: 'Insurance', label: 'Insurance', icon: '🛡️' },
  { value: 'Subscriptions', label: 'Subscriptions', icon: '📱' },
  { value: 'Personal Care', label: 'Personal Care', icon: '💅' },
  { value: 'Fitness', label: 'Fitness', icon: '💪' },
  { value: 'Travel', label: 'Travel', icon: '✈️' },
  { value: 'Gifts', label: 'Gifts & Donations', icon: '🎁' },
  { value: 'custom', label: '+ Add Custom Category', icon: '✨' },
]

interface AddExpenseFormProps {
  onSuccess?: () => void
}

export function AddExpenseForm({ onSuccess }: AddExpenseFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    customCategory: '',
    date: new Date().toISOString().split('T')[0],
    accountId: '',
  })
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true)
      setFormData({ ...formData, category: '' })
    } else {
      setShowCustomCategory(false)
      setFormData({ ...formData, category: value, customCategory: '' })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }
      setReceiptFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const categoryToUse = showCustomCategory ? formData.customCategory : formData.category

    if (!formData.amount || !categoryToUse || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          description: formData.description,
          category: categoryToUse,
          type: 'expense',
          date: new Date(formData.date || new Date().toISOString()),
          accountId: formData.accountId || null,
          hasReceipt: receiptFile !== null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to add expense')
      }

      toast.success('Expense added successfully!')

      // Reset form
      setFormData({
        amount: '',
        description: '',
        category: '',
        customCategory: '',
        date: new Date().toISOString().split('T')[0],
        accountId: '',
      })
      setReceiptFile(null)
      setShowCustomCategory(false)
      setOpen(false)

      router.refresh()
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full transition-all duration-300 hover:scale-105" size="sm" variant="outline">
          <MinusCircle className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Record a new expense transaction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {!showCustomCategory ? (
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  id="customCategory"
                  placeholder="Enter custom category"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setShowCustomCategory(false)
                    setFormData({ ...formData, customCategory: '' })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Grocery shopping"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('receipt')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {receiptFile ? receiptFile.name : 'Upload Receipt'}
              </Button>
              {receiptFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setReceiptFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {receiptFile && (
              <p className="text-xs text-muted-foreground">
                {(receiptFile.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
