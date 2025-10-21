/**
 * StatusCell Component
 * 
 * Status badge with inline dropdown editor
 */

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StatusCellProps {
  status: 'todo' | 'in_progress' | 'review' | 'done'
  onUpdate: (status: 'todo' | 'in_progress' | 'review' | 'done') => Promise<void>
  isEditing: boolean
  onStartEdit: () => void
  onEndEdit: () => void
}

const STATUS_CONFIG = {
  todo: { label: 'To Do', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  review: { label: 'Review', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  done: { label: 'Done', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
}

export default function StatusCell({
  status,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
}: StatusCellProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = async (value: string) => {
    await onUpdate(value as any)
    setIsOpen(false)
    onEndEdit()
  }

  const config = STATUS_CONFIG[status]

  if (isEditing || isOpen) {
    return (
      <Select
        open={isOpen || isEditing}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) onEndEdit()
        }}
        value={status}
        onValueChange={handleChange}
      >
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  return (
    <Badge className={`cursor-pointer ${config.className}`} onClick={onStartEdit}>
      {config.label}
    </Badge>
  )
}

