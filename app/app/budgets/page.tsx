"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus } from 'lucide-react'
import { BudgetsTable } from '@/components/budgets/budgets-table'
import { AddBudgetDialog } from '@/components/budgets/add-budget-dialog'

export default function BudgetsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleBudgetAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/app/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
            <p className="text-muted-foreground">
              Manage your spending budgets by category
            </p>
          </div>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
          <CardDescription>Track spending limits and get alerts when approaching budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetsTable key={refreshTrigger} />
        </CardContent>
      </Card>

      {/* Add Budget Dialog */}
      <AddBudgetDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleBudgetAdded}
      />
    </div>
  )
}
