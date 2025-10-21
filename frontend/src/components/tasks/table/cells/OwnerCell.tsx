/**
 * OwnerCell Component
 * 
 * Owner display and inline editing
 */

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Task } from '@/types/database.types'

interface OwnerCellProps {
  task: Task
  onUpdate: (ownerId: string | null) => Promise<void>
  isEditing: boolean
  onStartEdit: () => void
  onEndEdit: () => void
}

export default function OwnerCell({
  task,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
}: OwnerCellProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = async (value: string) => {
    const ownerId = value === 'unassigned' ? null : value
    await onUpdate(ownerId)
    onEndEdit()
    setIsOpen(false)
  }

  // For MVP, show placeholder without real owner data
  const ownerInitials = task.owner_id ? 'AS' : null
  const ownerName = task.owner_id ? 'Assigned' : 'Unassigned'

  if (isEditing || isOpen) {
    return (
      <Select
        open={isOpen || isEditing}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) onEndEdit()
        }}
        value={task.owner_id || 'unassigned'}
        onValueChange={handleChange}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Select owner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {/* In real app, map over team members */}
          <SelectItem value="placeholder-id">Team Member</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
      onClick={onStartEdit}
    >
      {ownerInitials ? (
        <>
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{ownerInitials}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{ownerName}</span>
        </>
      ) : (
        <span className="text-sm text-gray-400">{ownerName}</span>
      )}
    </div>
  )
}

