'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { SpendingByCategoryChart } from '@/components/analytics/spending-by-category-chart'
import { MonthlyTrendsChart } from '@/components/analytics/monthly-trends-chart'
import { FinancialHealthScore } from '@/components/analytics/financial-health-score'
import { TopSpendingCategories } from '@/components/analytics/top-spending-categories'
import { BudgetVsActualChart } from '@/components/analytics/budget-vs-actual-chart'
import { NetWorthChart } from '@/components/analytics/net-worth-chart'
import { ExportButton } from '@/components/export-button'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/app/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
            <p className="text-muted-foreground">
              Understand your financial patterns and trends
            </p>
          </div>
        </div>
        <ExportButton type="analytics" />
      </div>

      {/* Financial Health Score */}
      <FinancialHealthScore />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trends */}
        <MonthlyTrendsChart />

        {/* Spending by Category */}
        <SpendingByCategoryChart />
      </div>

      {/* Top Spending Categories */}
      <TopSpendingCategories />

      {/* Additional Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Budget vs Actual */}
        <BudgetVsActualChart />

        {/* Net Worth Tracking */}
        <NetWorthChart />
      </div>
    </div>
  )
}
