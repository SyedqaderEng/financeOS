"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus } from 'lucide-react'
import { AccountsTable } from '@/components/accounts/accounts-table'
import { AddAccountDialog } from '@/components/accounts/add-account-dialog'

export default function AccountsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAccountAdded = () => {
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
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">
              Manage all your financial accounts
            </p>
          </div>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>View, edit, and manage your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountsTable key={refreshTrigger} />
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <AddAccountDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleAccountAdded}
      />
    </div>
  )
}
