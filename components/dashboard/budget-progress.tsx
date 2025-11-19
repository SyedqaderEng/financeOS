import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { PiggyBank, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface Budget {
  id: string
  category: string
  spent: number
  limit: number
  icon: string
}

interface BudgetProgressProps {
  budgets?: Budget[]
  isEmpty?: boolean
}

const defaultBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food & Dining',
    spent: 720,
    limit: 800,
    icon: '🍔',
  },
  {
    id: '2',
    category: 'Transportation',
    spent: 420,
    limit: 500,
    icon: '🚗',
  },
  {
    id: '3',
    category: 'Entertainment',
    spent: 180,
    limit: 200,
    icon: '🎮',
  },
  {
    id: '4',
    category: 'Shopping',
    spent: 340,
    limit: 300,
    icon: '🛍️',
  },
  {
    id: '5',
    category: 'Health & Fitness',
    spent: 95,
    limit: 150,
    icon: '💪',
  },
]

export function BudgetProgress({ budgets = defaultBudgets, isEmpty }: BudgetProgressProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-600 dark:bg-red-500'
    if (percentage >= 80) return 'bg-yellow-600 dark:bg-yellow-500'
    return 'bg-green-600 dark:bg-green-500'
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
    if (percentage >= 80) return <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-500" />
  }

  if (isEmpty) {
    return (
      <Card className="border-dashed transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-primary/50 group">
        <CardHeader>
          <CardTitle className="text-muted-foreground group-hover:text-primary transition-colors">
            Budget Progress
          </CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-primary/70 transition-colors">
            Track your spending by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <PiggyBank className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Create budgets to control your spending
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const overallPercentage = (totalSpent / totalLimit) * 100

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-primary" />
              </div>
              Budget Progress
            </CardTitle>
            <CardDescription className="mt-1">
              ${totalSpent.toLocaleString()} of ${totalLimit.toLocaleString()} spent ({overallPercentage.toFixed(0)}%)
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/budgets">
              Manage
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100
          const remaining = budget.limit - budget.spent
          const isOverBudget = percentage >= 100

          return (
            <div
              key={budget.id}
              className="p-3 rounded-lg border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/50 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">{budget.icon}</span>
                  <div>
                    <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                      {budget.category}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {isOverBudget ? (
                        <span className="text-red-600 dark:text-red-500 font-medium">
                          ${Math.abs(remaining).toLocaleString()} over budget
                        </span>
                      ) : (
                        <span>
                          ${remaining.toLocaleString()} remaining
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  {getStatusIcon(percentage)}
                  <div>
                    <div className="text-sm font-bold" style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}>
                      ${budget.spent.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of ${budget.limit.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-2"
                  indicatorClassName={getProgressColor(percentage)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}% used
                  </span>
                  {percentage >= 80 && percentage < 100 && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">
                      Approaching limit
                    </span>
                  )}
                  {percentage >= 100 && (
                    <span className="text-xs text-red-600 dark:text-red-500 font-medium">
                      Budget exceeded
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
