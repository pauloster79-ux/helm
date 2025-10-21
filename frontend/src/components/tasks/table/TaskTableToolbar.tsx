/**
 * TaskTableToolbar Component
 * 
 * Toolbar with search, filters, and stats for the task table
 */

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'
import type { Task } from '@/types/database.types'
import type { Table } from '@tanstack/react-table'

interface TaskTableToolbarProps {
  globalFilter: string
  setGlobalFilter: (value: string) => void
  table?: Table<any>
  tasks?: Task[]
}

export default function TaskTableToolbar({
  globalFilter,
  setGlobalFilter,
}: TaskTableToolbarProps) {
  return (
    <div className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter button - placeholder for future */}
        <Button variant="outline" size="sm" disabled>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  )
}

