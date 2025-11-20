'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { GoalsTable } from '@/components/goals/goals-table'
import { AddGoalDialog } from '@/components/goals/add-goal-dialog'

export default function GoalsPage() {
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleGoalAdded = () => {
    // Trigger refresh of GoalsTable
    setRefreshKey(prev => prev + 1)
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
        <AddGoalDialog onSuccess={handleGoalAdded} />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Goals</CardTitle>
          <CardDescription>Set targets, track progress, and achieve your financial dreams</CardDescription>
        </CardHeader>
        <CardContent>
          <GoalsTable key={refreshKey} />
        </CardContent>
      </Card>
    </div>
  )
}
