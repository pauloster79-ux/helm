/**
 * ActionsCell Component
 * 
 * Actions dropdown menu for task row
 */

import { MoreVertical, Eye, Copy, Trash2, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Task } from '@/types/database.types'

interface ActionsCellProps {
  task: Task
  onView: () => void
  onDelete: () => void
  onViewLatestPosition?: () => void
}

export default function ActionsCell({ onView, onDelete, onViewLatestPosition }: ActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {onViewLatestPosition && (
          <DropdownMenuItem onClick={onViewLatestPosition}>
            <History className="mr-2 h-4 w-4" />
            Latest Position
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

