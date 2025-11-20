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
import { Pencil, Trash2, Target, TrendingUp, Plus, History } from 'lucide-react'
import { toast } from 'sonner'
import { EditGoalDialog } from './edit-goal-dialog'
import { AddContributionDialog } from './add-contribution-dialog'
import { ContributionHistoryDialog } from './contribution-history-dialog'

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
  createdAt: string
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

export function GoalsTable() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [contributingGoal, setContributingGoal] = useState<Goal | null>(null)
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/goals')
      const result = await response.json()

      if (result.success && result.data) {
        setGoals(result.data)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, goalName: string) => {
    if (!confirm(`Are you sure you want to delete the goal "${goalName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Goal deleted successfully')
        fetchGoals() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to delete goal')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Failed to delete goal')
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

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getProgressColor = (percentComplete: number) => {
    if (percentComplete >= 100) return 'bg-green-500'
    if (percentComplete >= 75) return 'bg-blue-500'
    if (percentComplete >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getStatusBadge = (percentComplete: number, daysRemaining: number) => {
    if (percentComplete >= 100) {
      return <Badge className="bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20">Completed</Badge>
    }
    if (daysRemaining < 0) {
      return <Badge variant="destructive">Overdue</Badge>
    }
    if (daysRemaining <= 30) {
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20">Urgent</Badge>
    }
    return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20">Active</Badge>
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading goals...</p>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by creating your first financial goal!
        </p>
      </div>
    )
  }

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Total Goals</p>
          <h3 className="text-2xl font-bold">{goals.length}</h3>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20">
          <p className="text-sm text-muted-foreground mb-1">Target Amount</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalTarget)}</h3>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20">
          <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalSaved)}</h3>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
          <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
          <h3 className="text-2xl font-bold">{overallProgress.toFixed(0)}%</h3>
        </div>
      </div>

      {/* Goals Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Goal Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Target</TableHead>
              <TableHead className="text-right">Saved</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Target Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => {
              const percentComplete = (goal.currentAmount / goal.targetAmount) * 100
              const remaining = goal.targetAmount - goal.currentAmount
              const daysRemaining = getDaysRemaining(goal.targetDate)

              return (
                <TableRow key={goal.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{goal.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{goal.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(goal.targetAmount)}
                  </TableCell>
                  <TableCell className="text-right text-green-600 dark:text-green-500 font-semibold">
                    {formatCurrency(goal.currentAmount)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[150px]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatCurrency(remaining)} to go
                        </span>
                        <span className="font-semibold">
                          {percentComplete.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentComplete, 100)}
                        className="h-2"
                        indicatorClassName={getProgressColor(percentComplete)}
                      />
                      <ContributionHistoryDialog
                        goal={{
                          id: goal.id,
                          name: goal.name,
                          currentAmount: goal.currentAmount,
                          targetAmount: goal.targetAmount
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(goal.targetDate)}</div>
                      <div className="text-xs text-muted-foreground">
                        {daysRemaining >= 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(percentComplete, daysRemaining)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setContributingGoal(goal)
                          setContributionDialogOpen(true)
                        }}
                        title="Add contribution"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingGoal(goal)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(goal.id, goal.name)}
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

      {/* Edit Goal Dialog */}
      <EditGoalDialog
        goal={editingGoal}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchGoals}
      />

      {/* Add Contribution Dialog */}
      <AddContributionDialog
        goal={contributingGoal}
        open={contributionDialogOpen}
        onOpenChange={setContributionDialogOpen}
        onSuccess={fetchGoals}
      />
    </div>
  )
}
