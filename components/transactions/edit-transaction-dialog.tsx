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

interface Account {
  id: string
  name: string
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  transactionType: 'income' | 'expense'
  category: string
  account: {
    id: string
    name: string
  }
}

interface EditTransactionDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental Income',
  'Gift',
  'Refund',
  'Other Income',
]

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

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onSuccess,
}: EditTransactionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    transactionType: 'expense' as 'income' | 'expense',
    accountId: '',
    customCategory: '',
    showCustomCategory: false,
  })

  useEffect(() => {
    if (transaction && open) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split('T')[0],
        transactionType: transaction.transactionType,
        accountId: transaction.account.id,
        customCategory: '',
        showCustomCategory: false,
      })
      fetchAccounts()
    }
  }, [transaction, open])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      const result = await response.json()
      if (result.success && result.data) {
        setAccounts(result.data)
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transaction) return

    setLoading(true)

    try {
      const category = formData.showCustomCategory
        ? formData.customCategory
        : formData.category

      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category,
          date: formData.date,
          transactionType: formData.transactionType,
          accountId: formData.accountId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Transaction updated successfully')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to update transaction')
      }
    } catch (error) {
      console.error('Error updating transaction:', error)
      toast.error('Failed to update transaction')
    } finally {
      setLoading(false)
    }
  }

  const categories =
    formData.transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the transaction details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Grocery shopping"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
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
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.transactionType}
              onValueChange={(value: 'income' | 'expense') =>
                setFormData({ ...formData, transactionType: value, category: '' })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!formData.showCustomCategory ? (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setFormData({ ...formData, showCustomCategory: true })
                  } else {
                    setFormData({ ...formData, category: value })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">+ Add Custom Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="customCategory">Custom Category</Label>
              <div className="flex gap-2">
                <Input
                  id="customCategory"
                  value={formData.customCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, customCategory: e.target.value })
                  }
                  placeholder="Enter custom category"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      showCustomCategory: false,
                      customCategory: '',
                    })
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) =>
                setFormData({ ...formData, accountId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
