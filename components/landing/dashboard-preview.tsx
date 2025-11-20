"use client"

import { Card } from '@/components/ui/card'
import { AnimatedChart } from './animated-chart'
import { TrendingUp, TrendingDown, DollarSign, Wallet, Target, PiggyBank } from 'lucide-react'

export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Dashboard Preview */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, Qader!
            </h3>
            <div className="text-sm text-muted-foreground">November 2025</div>
          </div>
          <p className="text-muted-foreground">Here's an overview of your financial health</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Net Worth"
            value="$127,450"
            change="+12.5%"
            positive
          />
          <StatCard
            icon={<Wallet className="h-5 w-5" />}
            label="Total Balance"
            value="$45,280"
            change="+5.2%"
            positive
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Monthly Income"
            value="$8,500"
            change="+2.1%"
            positive
          />
          <StatCard
            icon={<PiggyBank className="h-5 w-5" />}
            label="Savings Rate"
            value="32%"
            change="+4%"
            positive
          />
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Net Worth Chart */}
          <Card className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur border-slate-200 dark:border-slate-700">
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Net Worth Trend</h4>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="h-48">
              <AnimatedChart type="line" delay={300} />
            </div>
          </Card>

          {/* Spending by Category */}
          <Card className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur border-slate-200 dark:border-slate-700">
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Spending by Category</h4>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div className="h-48">
              <AnimatedChart type="donut" delay={600} />
            </div>
          </Card>

          {/* Monthly Cash Flow */}
          <Card className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur border-slate-200 dark:border-slate-700 md:col-span-2">
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Monthly Cash Flow</h4>
              <p className="text-xs text-muted-foreground">Income vs Expenses</p>
            </div>
            <div className="h-48">
              <AnimatedChart type="bar" delay={900} />
            </div>
          </Card>
        </div>

        {/* Floating Cards */}
        <div className="absolute -top-4 -right-4 hidden lg:block">
          <FloatingCard delay={0}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget Savings</p>
                <p className="text-lg font-bold text-green-600">+$1,250</p>
              </div>
            </div>
          </FloatingCard>
        </div>

        <div className="absolute -bottom-4 -left-4 hidden lg:block">
          <FloatingCard delay={200}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Goals Progress</p>
                <p className="text-lg font-bold text-blue-600">78%</p>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-3xl" />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  change,
  positive
}: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          positive ? 'text-green-600' : 'text-red-600'
        }`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {change}
        </div>
      </div>
    </div>
  )
}

function FloatingCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 animate-float"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
