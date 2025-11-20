import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus } from 'lucide-react'
import { BudgetsTable } from '@/components/budgets/budgets-table'

export default async function BudgetsPage() {
  let user
  try {
    user = await getCurrentUser()
  } catch {
    redirect('/login')
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
        <Button asChild>
          <Link href="/app/dashboard">
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
          <CardDescription>Track spending limits and get alerts when approaching budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetsTable />
        </CardContent>
      </Card>
    </div>
  )
}
