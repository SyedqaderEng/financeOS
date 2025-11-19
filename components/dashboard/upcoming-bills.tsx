import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Bill {
  id: string
  name: string
  amount: string
  dueDate: string
  category: string
  status: 'upcoming' | 'due-soon' | 'overdue' | 'paid'
  icon: string
}

interface UpcomingBillsProps {
  bills?: Bill[]
  isEmpty?: boolean
}

const defaultBills: Bill[] = [
  {
    id: '1',
    name: 'Rent Payment',
    amount: '$2,100',
    dueDate: 'Nov 25',
    category: 'Housing',
    status: 'due-soon',
    icon: '🏠',
  },
  {
    id: '2',
    name: 'Electric Bill',
    amount: '$145',
    dueDate: 'Nov 28',
    category: 'Utilities',
    status: 'upcoming',
    icon: '⚡',
  },
  {
    id: '3',
    name: 'Internet Service',
    amount: '$89',
    dueDate: 'Nov 30',
    category: 'Utilities',
    status: 'upcoming',
    icon: '📡',
  },
  {
    id: '4',
    name: 'Car Insurance',
    amount: '$180',
    dueDate: 'Dec 1',
    category: 'Insurance',
    status: 'upcoming',
    icon: '🚗',
  },
  {
    id: '5',
    name: 'Netflix Subscription',
    amount: '$15.99',
    dueDate: 'Dec 3',
    category: 'Entertainment',
    status: 'upcoming',
    icon: '🎬',
  },
]

export function UpcomingBills({ bills = defaultBills, isEmpty }: UpcomingBillsProps) {
  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'due-soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-500 border-yellow-300 dark:border-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-500 border-red-300 dark:border-red-800'
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-500 border-green-300 dark:border-green-800'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-500 border-blue-300 dark:border-blue-800'
    }
  }

  const getStatusLabel = (status: Bill['status']) => {
    switch (status) {
      case 'due-soon':
        return 'Due Soon'
      case 'overdue':
        return 'Overdue'
      case 'paid':
        return 'Paid'
      default:
        return 'Upcoming'
    }
  }

  const getStatusIcon = (status: Bill['status']) => {
    switch (status) {
      case 'due-soon':
        return <AlertCircle className="h-3 w-3" />
      case 'overdue':
        return <AlertCircle className="h-3 w-3" />
      case 'paid':
        return <CheckCircle2 className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  if (isEmpty) {
    return (
      <Card className="border-dashed transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-primary/50 group">
        <CardHeader>
          <CardTitle className="text-muted-foreground group-hover:text-primary transition-colors">
            Upcoming Bills
          </CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-primary/70 transition-colors">
            Your scheduled payments will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Set up recurring bills to track payments
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalUpcoming = bills
    .filter(b => b.status !== 'paid')
    .reduce((sum, bill) => sum + parseFloat(bill.amount.replace(/[$,]/g, '')), 0)

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Upcoming Bills
            </CardTitle>
            <CardDescription className="mt-1">
              {bills.filter(b => b.status !== 'paid').length} bills • ${totalUpcoming.toFixed(2)} total
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/bills">
              Manage
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/50 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              {bill.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {bill.name}
                </h4>
                <Badge variant="outline" className={`text-[10px] h-4 px-1 flex items-center gap-1 ${getStatusColor(bill.status)}`}>
                  {getStatusIcon(bill.status)}
                  {getStatusLabel(bill.status)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {bill.category} • Due {bill.dueDate}
              </p>
            </div>
            <div className="text-right">
              <div
                className="text-base font-bold"
                style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}
              >
                {bill.amount}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
