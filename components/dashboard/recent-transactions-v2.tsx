"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Receipt, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  transactionType: 'income' | 'expense'
  category: {
    id: string
    name: string
    icon?: string
  }
  account: {
    id: string
    name: string
  }
}

interface RecentTransactionsV2Props {
  isLoading?: boolean
  isEmpty?: boolean
}

export function RecentTransactionsV2({ isLoading, isEmpty }: RecentTransactionsV2Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions?limit=5')
        const data = await response.json()
        if (data.success) {
          setTransactions(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      // Income
      'Salary': '💼',
      'Freelance': '💻',
      'Business': '🏢',
      'Investment': '📈',
      'Gift': '🎁',
      'Refund': '💵',
      // Expense
      'Food & Dining': '🍔',
      'Housing': '🏠',
      'Transportation': '🚗',
      'Utilities': '⚡',
      'Entertainment': '🎮',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Education': '📚',
      'Insurance': '🛡️',
      'Subscriptions': '📱',
      'Other': '💳',
    }
    return iconMap[categoryName] || '💰'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading || isLoading) {
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

  if (isEmpty || transactions.length === 0) {
    return (
      <Card className="border-dashed transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-primary/50 group">
        <CardHeader>
          <CardTitle className="text-muted-foreground group-hover:text-primary transition-colors">Recent Transactions</CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-primary/70 transition-colors">
            Your latest 5 transactions will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:shadow-lg group-hover:shadow-primary/30">
              <Receipt className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2 group-hover:text-foreground transition-colors">
              No transactions yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4 group-hover:text-primary/70 transition-colors">
              Start tracking your finances by adding your first transaction.
            </p>
            <Button asChild variant="outline" className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary">
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

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
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
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/50 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform ${
                  transaction.transactionType === 'income'
                    ? 'bg-green-500/10 dark:bg-green-500/20'
                    : 'bg-red-500/10 dark:bg-red-500/20'
                }`}>
                  {transaction.category.icon || getCategoryIcon(transaction.category.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {transaction.description}
                    </p>
                    {transaction.transactionType === 'income' ? (
                      <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-500 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{transaction.category.name}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${
                  transaction.transactionType === 'income'
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-red-600 dark:text-red-500'
                }`}>
                  {transaction.transactionType === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {transaction.account.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
