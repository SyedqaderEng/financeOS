import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Receipt, ArrowRight } from 'lucide-react'

interface RecentTransactionsProps {
  isLoading?: boolean
  isEmpty?: boolean
}

export function RecentTransactions({ isLoading, isEmpty }: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-56" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Recent Transactions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your latest 5 transactions will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Receipt className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No transactions yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Start tracking your finances by adding your first transaction.
            </p>
            <Button asChild variant="outline">
              <Link href="/app/transactions">
                Add Transaction
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Actual transactions list will be implemented when we have data
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest 5 transactions</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/app/transactions">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Transactions list will render here */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center py-8">
            Transactions will render here
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
