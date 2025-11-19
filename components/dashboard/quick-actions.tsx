import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Wallet, Receipt, ArrowLeftRight, PiggyBank } from 'lucide-react'

const quickActions = [
  {
    name: 'Add Account',
    description: 'Connect or add a financial account',
    href: '/app/accounts',
    icon: Wallet,
    color: 'text-blue-600 dark:text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-950',
  },
  {
    name: 'Add Transaction',
    description: 'Record a new transaction',
    href: '/app/transactions',
    icon: Receipt,
    color: 'text-green-600 dark:text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-950',
  },
  {
    name: 'Transfer Money',
    description: 'Move funds between accounts',
    href: '/app/accounts?action=transfer',
    icon: ArrowLeftRight,
    color: 'text-purple-600 dark:text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-950',
  },
  {
    name: 'Create Budget',
    description: 'Set up a new budget category',
    href: '/app/budgets',
    icon: PiggyBank,
    color: 'text-orange-600 dark:text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-950',
  },
]

export function QuickActions() {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon

          return (
            <Button
              key={action.name}
              asChild
              variant="outline"
              className="h-auto p-4 justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 group"
            >
              <Link href={action.href}>
                <div className="flex items-start gap-3 w-full">
                  <div className={`h-12 w-12 rounded-lg ${action.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${action.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium group-hover:text-primary transition-colors">{action.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-primary/70 transition-colors">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
