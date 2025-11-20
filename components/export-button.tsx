"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface ExportButtonProps {
  type: 'transactions' | 'budgets' | 'goals' | 'analytics'
}

export function ExportButton({ type }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const exportToCSV = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/export/${type}?format=csv`)
      const result = await response.json()

      if (result.success && result.data) {
        // Convert data to CSV
        const csv = convertToCSV(result.data)
        downloadFile(csv, `${type}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
        toast.success(`${type} exported successfully`)
      } else {
        toast.error(result.error || 'Failed to export data')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const exportToJSON = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/export/${type}?format=json`)
      const result = await response.json()

      if (result.success && result.data) {
        const json = JSON.stringify(result.data, null, 2)
        downloadFile(json, `${type}-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
        toast.success(`${type} exported successfully`)
      } else {
        toast.error(result.error || 'Failed to export data')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''

    // Get headers
    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(',')

    // Get rows
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header]
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    })

    return [csvHeaders, ...csvRows].join('\n')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
