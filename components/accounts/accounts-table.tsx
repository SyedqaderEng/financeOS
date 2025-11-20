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
import { Pencil, Trash2, Wallet, CreditCard, PiggyBank, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { EditAccountDialog } from './edit-account-dialog'

interface Account {
  id: string
  name: string
  type: string
  balance: number
  institution?: string | null
  createdAt: string
}

const ACCOUNT_TYPE_ICONS = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
}

const ACCOUNT_TYPE_COLORS = {
  checking: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20',
  savings: 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20',
  credit: 'bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20',
  investment: 'bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20',
}

export function AccountsTable() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/accounts')
      const result = await response.json()

      if (result.success && result.data) {
        setAccounts(result.data)
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      toast.error('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, accountName: string) => {
    if (!confirm(`Are you sure you want to delete "${accountName}"? This will also delete all associated transactions.`)) {
      return
    }

    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Account deleted successfully')
        fetchAccounts() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading accounts...</p>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by adding your first account to track your finances!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Balance Across All Accounts</p>
            <h2 className="text-3xl font-bold">{formatCurrency(totalBalance)}</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Active Accounts</p>
            <p className="text-2xl font-semibold">{accounts.length}</p>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => {
              const Icon = ACCOUNT_TYPE_ICONS[account.type as keyof typeof ACCOUNT_TYPE_ICONS] || Wallet
              const colorClass = ACCOUNT_TYPE_COLORS[account.type as keyof typeof ACCOUNT_TYPE_COLORS] || 'bg-gray-500/10 text-gray-600'

              return (
                <TableRow key={account.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {account.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {account.institution || '—'}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${
                    account.balance >= 0
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}>
                    {formatCurrency(account.balance)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(account.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingAccount(account)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(account.id, account.name)}
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

      {/* Account Type Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(
          accounts.reduce((acc, account) => {
            acc[account.type] = (acc[account.type] || 0) + account.balance
            return acc
          }, {} as Record<string, number>)
        ).map(([type, balance]) => {
          const Icon = ACCOUNT_TYPE_ICONS[type as keyof typeof ACCOUNT_TYPE_ICONS] || Wallet
          const colorClass = ACCOUNT_TYPE_COLORS[type as keyof typeof ACCOUNT_TYPE_COLORS]

          return (
            <div key={type} className={`p-4 rounded-lg border ${colorClass}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium capitalize">{type}</span>
              </div>
              <p className="text-lg font-bold">{formatCurrency(balance)}</p>
            </div>
          )
        })}
      </div>

      {/* Edit Account Dialog */}
      <EditAccountDialog
        account={editingAccount}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchAccounts}
      />
    </div>
  )
}
