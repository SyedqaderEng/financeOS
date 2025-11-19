import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, TrendingUp, AlertCircle, Target } from 'lucide-react'

interface Insight {
  id: string
  type: 'tip' | 'alert' | 'achievement' | 'goal'
  title: string
  description: string
  priority?: 'high' | 'medium' | 'low'
}

const defaultInsights: Insight[] = [
  {
    id: '1',
    type: 'tip',
    title: 'Welcome to FinanceOS!',
    description: 'Start by adding your financial accounts to get a complete view of your finances.',
    priority: 'high',
  },
  {
    id: '2',
    type: 'tip',
    title: 'Track your expenses',
    description: 'Add transactions manually or connect your bank accounts for automatic tracking.',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'goal',
    title: 'Set financial goals',
    description: 'Create savings goals to stay motivated and track your progress.',
    priority: 'medium',
  },
  {
    id: '4',
    type: 'tip',
    title: 'Create budgets',
    description: 'Set monthly budgets for different categories to control your spending.',
    priority: 'low',
  },
]

interface InsightsPanelProps {
  insights?: Insight[]
}

export function InsightsPanel({ insights = defaultInsights }: InsightsPanelProps) {
  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'tip':
        return Lightbulb
      case 'alert':
        return AlertCircle
      case 'achievement':
        return TrendingUp
      case 'goal':
        return Target
      default:
        return Lightbulb
    }
  }

  const getColor = (type: Insight['type']) => {
    switch (type) {
      case 'tip':
        return 'text-blue-600 dark:text-blue-500'
      case 'alert':
        return 'text-yellow-600 dark:text-yellow-500'
      case 'achievement':
        return 'text-green-600 dark:text-green-500'
      case 'goal':
        return 'text-purple-600 dark:text-purple-500'
      default:
        return 'text-blue-600 dark:text-blue-500'
    }
  }

  const getBgColor = (type: Insight['type']) => {
    switch (type) {
      case 'tip':
        return 'bg-blue-100 dark:bg-blue-950'
      case 'alert':
        return 'bg-yellow-100 dark:bg-yellow-950'
      case 'achievement':
        return 'bg-green-100 dark:bg-green-950'
      case 'goal':
        return 'bg-purple-100 dark:bg-purple-950'
      default:
        return 'bg-blue-100 dark:bg-blue-950'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights & Tips</CardTitle>
        <CardDescription>
          Personalized recommendations for your finances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.type)
          const color = getColor(insight.type)
          const bgColor = getBgColor(insight.type)

          return (
            <div
              key={insight.id}
              className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className={`h-8 w-8 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  {insight.priority === 'high' && (
                    <Badge variant="destructive" className="text-[10px] h-4 px-1">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
