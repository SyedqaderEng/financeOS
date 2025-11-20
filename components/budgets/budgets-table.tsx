"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Pencil, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { EditBudgetDialog } from './edit-budget-dialog'

interface Budget {
  id: string
  name: string
  category: string
  amount: number
  period: string
  alertThreshold: number
  createdAt: string
  currentSpending?: number
  percentUsed?: number
}

const PERIOD_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
}

export function BudgetsTable() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/budgets?includeStats=true')
      const result = await response.json()

      if (result.success && result.data) {
        setBudgets(result.data)
      }
    } catch (error) {
      console.error('Error fetching budgets:', error)
      toast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, budgetName: string) => {
    if (!confirm(`Are you sure you want to delete the budget "${budgetName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Budget deleted successfully')
        fetchBudgets() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to delete budget')
      }
    } catch (error) {
      console.error('Error deleting budget:', error)
      toast.error('Failed to delete budget')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (percentUsed: number = 0, threshold: number) => {
    if (percentUsed >= 100) return 'text-red-600 dark:text-red-500'
    if (percentUsed >= threshold) return 'text-amber-600 dark:text-amber-500'
    return 'text-green-600 dark:text-green-500'
  }

  const getProgressColor = (percentUsed: number = 0, threshold: number) => {
    if (percentUsed >= 100) return 'bg-red-500'
    if (percentUsed >= threshold) return 'bg-amber-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading budgets...</p>
      </div>
    )
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by creating your first budget to track spending!
        </p>
      </div>
    )
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpending = budgets.reduce((sum, budget) => sum + (budget.currentSpending || 0), 0)

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalBudget)}</h3>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
          <p className="text-sm text-muted-foreground mb-1">Total Spending</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalSpending)}</h3>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20">
          <p className="text-sm text-muted-foreground mb-1">Remaining</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalBudget - totalSpending)}</h3>
        </div>
      </div>

      {/* Budgets Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Budget Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => {
              const percentUsed = budget.percentUsed || 0
              const remaining = budget.amount - (budget.currentSpending || 0)

              return (
                <TableRow key={budget.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{budget.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{budget.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {PERIOD_LABELS[budget.period] || budget.period}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(budget.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 min-w-[150px]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatCurrency(budget.currentSpending || 0)} spent
                        </span>
                        <span className={getStatusColor(percentUsed, budget.alertThreshold)}>
                          {percentUsed.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentUsed, 100)}
                        className="h-2"
                        indicatorClassName={getProgressColor(percentUsed, budget.alertThreshold)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {percentUsed >= 100 ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Over Budget
                      </Badge>
                    ) : percentUsed >= budget.alertThreshold ? (
                      <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-500">
                        <AlertCircle className="h-3 w-3" />
                        Warning
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 dark:text-green-500">
                        <CheckCircle2 className="h-3 w-3" />
                        On Track
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingBudget(budget)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(budget.id, budget.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit Budget Dialog */}
      <EditBudgetDialog
        budget={editingBudget}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchBudgets}
      />
    </div>
  )
}
