"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Wallet, TrendingUp, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface Account {
  id: string
  name: string
  accountType: string
  currentBalance: number
  institution: string | null
  lastSyncedAt?: string | null
  updatedAt: string
}

interface AccountOverviewProps {
  isEmpty?: boolean
}

export function AccountOverviewV2({ isEmpty }: AccountOverviewProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/accounts')
        const data = await response.json()
        if (data.success) {
          setAccounts(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching accounts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatRelativeTime = (date: string | null | undefined) => {
    if (!date) return 'Just now'
    const now = new Date()
    const syncDate = new Date(date)
    const diffMs = now.getTime() - syncDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return Building2
      case 'savings':
        return Wallet
      case 'investment':
        return TrendingUp
      case 'credit':
      case 'credit_card':
        return CreditCard
      default:
        return Wallet
    }
  }

  const getAccountColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return 'text-blue-600 dark:text-blue-500'
      case 'savings':
        return 'text-green-600 dark:text-green-500'
      case 'investment':
        return 'text-purple-600 dark:text-purple-500'
      case 'credit':
      case 'credit_card':
        return 'text-orange-600 dark:text-orange-500'
      default:
        return 'text-blue-600 dark:text-blue-500'
    }
  }

  const getAccountBgColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return 'bg-blue-100 dark:bg-blue-950'
      case 'savings':
        return 'bg-green-100 dark:bg-green-950'
      case 'investment':
        return 'bg-purple-100 dark:bg-purple-950'
      case 'credit':
      case 'credit_card':
        return 'bg-orange-100 dark:bg-orange-950'
      default:
        return 'bg-blue-100 dark:bg-blue-950'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return 'Checking'
      case 'savings':
        return 'Savings'
      case 'investment':
        return 'Investment'
      case 'credit':
      case 'credit_card':
        return 'Credit Card'
      default:
        return type
    }
  }

  if (loading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24 mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isEmpty || accounts.length === 0) {
    return (
      <Card className="border-dashed transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-primary/50 group">
        <CardHeader>
          <CardTitle className="text-muted-foreground group-hover:text-primary transition-colors">
            Account Overview
          </CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-primary/70 transition-colors">
            Your connected accounts will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Add your first account to get started
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">Account Overview</CardTitle>
              <CardDescription className="mt-1">
                {accounts.length} connected account{accounts.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="flex-shrink-0">
            <Link href="/app/accounts">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.accountType)
          const color = getAccountColor(account.accountType)
          const bgColor = getAccountBgColor(account.accountType)
          const isNegative = account.currentBalance < 0

          return (
            <div
              key={account.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/50 cursor-pointer group"
            >
              <div className={`h-12 w-12 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 ${color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {account.name}
                  </h4>
                  <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {getTypeLabel(account.accountType)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {account.institution || 'No institution'} • {formatRelativeTime(account.updatedAt)}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-base font-bold ${
                    isNegative ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'
                  }`}
                  style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}
                >
                  {formatCurrency(account.currentBalance)}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
