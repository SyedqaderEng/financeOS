import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus } from 'lucide-react'
import { GoalsTable } from '@/components/goals/goals-table'

export default async function GoalsPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
            <p className="text-muted-foreground">
              Track and achieve your financial goals
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/app/dashboard">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Goals</CardTitle>
          <CardDescription>Set targets, track progress, and achieve your financial dreams</CardDescription>
        </CardHeader>
        <CardContent>
          <GoalsTable />
        </CardContent>
      </Card>
    </div>
  )
}
