import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Wallet, TrendingUp, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'credit'
  balance: string
  institution: string
  lastUpdated?: string
}

interface AccountOverviewProps {
  accounts?: Account[]
  isEmpty?: boolean
}

const defaultAccounts: Account[] = [
  {
    id: '1',
    name: 'Primary Checking',
    type: 'checking',
    balance: '$12,340',
    institution: 'Chase Bank',
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    name: 'High-Yield Savings',
    type: 'savings',
    balance: '$28,450',
    institution: 'Ally Bank',
    lastUpdated: '1 day ago',
  },
  {
    id: '3',
    name: 'Investment Portfolio',
    type: 'investment',
    balance: '$7,765',
    institution: 'Vanguard',
    lastUpdated: '3 hours ago',
  },
  {
    id: '4',
    name: 'Rewards Credit Card',
    type: 'credit',
    balance: '-$2,340',
    institution: 'American Express',
    lastUpdated: '5 hours ago',
  },
]

export function AccountOverview({ accounts = defaultAccounts, isEmpty }: AccountOverviewProps) {
  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return Building2
      case 'savings':
        return Wallet
      case 'investment':
        return TrendingUp
      case 'credit':
        return CreditCard
      default:
        return Wallet
    }
  }

  const getAccountColor = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'text-blue-600 dark:text-blue-500'
      case 'savings':
        return 'text-green-600 dark:text-green-500'
      case 'investment':
        return 'text-purple-600 dark:text-purple-500'
      case 'credit':
        return 'text-orange-600 dark:text-orange-500'
      default:
        return 'text-blue-600 dark:text-blue-500'
    }
  }

  const getAccountBgColor = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 dark:bg-blue-950'
      case 'savings':
        return 'bg-green-100 dark:bg-green-950'
      case 'investment':
        return 'bg-purple-100 dark:bg-purple-950'
      case 'credit':
        return 'bg-orange-100 dark:bg-orange-950'
      default:
        return 'bg-blue-100 dark:bg-blue-950'
    }
  }

  const getTypeLabel = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'Checking'
      case 'savings':
        return 'Savings'
      case 'investment':
        return 'Investment'
      case 'credit':
        return 'Credit Card'
      default:
        return type
    }
  }

  if (isEmpty) {
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
              Connect your first account to get started
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              Account Overview
            </CardTitle>
            <CardDescription className="mt-1">
              {accounts.length} connected account{accounts.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/accounts">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.type)
          const color = getAccountColor(account.type)
          const bgColor = getAccountBgColor(account.type)
          const isNegative = account.balance.startsWith('-')

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
                    {getTypeLabel(account.type)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {account.institution} • {account.lastUpdated}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-base font-bold ${
                    isNegative ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'
                  }`}
                  style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}
                >
                  {account.balance}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
