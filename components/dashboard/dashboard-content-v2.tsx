"use client"

import { useEffect, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { KPICard } from '@/components/dashboard/kpi-card'
import { CashFlowChartV2 } from '@/components/dashboard/cash-flow-chart-v2'
import { RecentTransactionsV2 } from '@/components/dashboard/recent-transactions-v2'
import { AccountOverviewV2 } from '@/components/dashboard/account-overview-v2'
import { BudgetProgressV2 } from '@/components/dashboard/budget-progress-v2'
import { CollapsiblePanel } from '@/components/dashboard/collapsible-panel'
import { AddIncomeForm } from '@/components/forms/add-income-form'
import { AddExpenseForm } from '@/components/forms/add-expense-form'
import { AddAccountForm } from '@/components/forms/add-account-form'
import { AddBudgetForm } from '@/components/forms/add-budget-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Receipt, TrendingUp as TrendingUpIcon } from 'lucide-react'
import Link from 'next/link'

interface DashboardContentProps {
  userName: string | null | undefined
  userEmail: string
}

interface DashboardStats {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  netWorth: number
  accountsCount: number
  transactionsCount: number
  trends?: {
    income: { value: number; isPositive: boolean }
    expenses: { value: number; isPositive: boolean }
    netWorth: { value: number; isPositive: boolean }
  }
}

export function DashboardContentV2({ userName, userEmail }: DashboardContentProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [refreshKey])

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1)
  }

  const isEmpty: boolean = !loading && !!stats && stats.accountsCount === 0 && stats.transactionsCount === 0

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg -z-10" />
        <div className="p-6 rounded-lg">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Welcome back, {userName?.split(' ')[0] || userEmail}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your financial health
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Balance"
          value={loading ? '...' : formatCurrency(stats?.totalBalance || 0)}
          icon={DollarSign}
          trend={stats?.trends?.income ? {
            value: stats.trends.income.value,
            label: 'this month',
            isPositive: stats.trends.income.isPositive,
          } : undefined}
          isEmpty={isEmpty}
          isLoading={loading}
          emptyMessage="Add accounts to see your total balance"
          description="Your total account balance across all connected accounts"
        />
        <KPICard
          title="Monthly Income"
          value={loading ? '...' : formatCurrency(stats?.monthlyIncome || 0)}
          icon={TrendingUp}
          trend={stats?.trends?.income ? {
            value: stats.trends.income.value,
            label: 'vs last month',
            isPositive: stats.trends.income.isPositive,
          } : undefined}
          isEmpty={isEmpty}
          isLoading={loading}
          emptyMessage="Add income transactions"
          description="Total income received this month"
        />
        <KPICard
          title="Monthly Expenses"
          value={loading ? '...' : formatCurrency(stats?.monthlyExpenses || 0)}
          icon={TrendingDown}
          trend={stats?.trends?.expenses ? {
            value: stats.trends.expenses.value,
            label: 'vs last month',
            isPositive: !stats.trends.expenses.isPositive, // Invert for expenses
          } : undefined}
          isEmpty={isEmpty}
          isLoading={loading}
          emptyMessage="Add expense transactions"
          description="Total expenses for this month"
        />
        <KPICard
          title="Net Worth"
          value={loading ? '...' : formatCurrency(stats?.netWorth || 0)}
          icon={Wallet}
          trend={stats?.trends?.netWorth ? {
            value: stats.trends.netWorth.value,
            label: 'this month',
            isPositive: stats.trends.netWorth.isPositive,
          } : undefined}
          isEmpty={isEmpty}
          isLoading={loading}
          emptyMessage="Assets minus liabilities"
          description="Your total net worth"
        />
      </div>

      {/* Main Content with Collapsible Panels */}
      <div className="flex gap-4">
        {/* Left Panel - Accounts */}
        <CollapsiblePanel side="left" defaultCollapsed={false} className="hidden lg:block">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Accounts</h3>
              <AddAccountForm onSuccess={handleDataChange} />
            </div>
            <AccountOverviewV2 isEmpty={isEmpty} key={refreshKey} />
          </div>
        </CollapsiblePanel>

        {/* Center Content - Cash Flow & Transactions */}
        <div className="flex-1 space-y-6 min-w-0">
          <CashFlowChartV2 isEmpty={isEmpty} isLoading={loading} key={refreshKey} />
          <RecentTransactionsV2 isEmpty={isEmpty} isLoading={loading} key={refreshKey} />

          {/* Mobile: Show panels below on small screens */}
          <div className="lg:hidden space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AddIncomeForm onSuccess={handleDataChange} />
                <AddExpenseForm onSuccess={handleDataChange} />
                <AddBudgetForm onSuccess={handleDataChange} />
              </CardContent>
            </Card>

            {/* Budget Progress for Mobile */}
            <BudgetProgressV2 isEmpty={isEmpty} isLoading={loading} key={refreshKey} />
          </div>
        </div>

        {/* Right Panel - Quick Actions */}
        <CollapsiblePanel side="right" defaultCollapsed={false} className="hidden lg:block">
          <div className="space-y-6">
            {/* Quick Actions Header Card */}
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <AddIncomeForm onSuccess={handleDataChange} />
                <AddExpenseForm onSuccess={handleDataChange} />
                <AddBudgetForm onSuccess={handleDataChange} />
              </CardContent>
            </Card>

            {/* Budget Progress */}
            <BudgetProgressV2 isEmpty={isEmpty} isLoading={loading} key={refreshKey} />

            {/* Quick Links */}
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <Receipt className="h-4 w-4 text-primary" />
                  </div>
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                >
                  <Link href="/app/transactions">
                    <Receipt className="h-4 w-4 mr-2" />
                    All Transactions
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                >
                  <Link href="/app/budgets">
                    <TrendingUpIcon className="h-4 w-4 mr-2" />
                    Budgets
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                >
                  <Link href="/app/goals">
                    <Wallet className="h-4 w-4 mr-2" />
                    Financial Goals
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CollapsiblePanel>
      </div>
    </div>
  )
}
