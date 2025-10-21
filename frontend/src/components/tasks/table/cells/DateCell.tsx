/**
 * DateCell Component
 * 
 * Date display and inline editing with calendar picker
 */

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DateCellProps {
  date: string | null
  onUpdate: (date: Date | null) => Promise<void>
  isEditing: boolean
  onStartEdit: () => void
  onEndEdit: () => void
}

export default function DateCell({
  date,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
}: DateCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dateValue = date ? new Date(date) : null

  const handleSelect = async (selectedDate: Date | undefined) => {
    await onUpdate(selectedDate || null)
    setIsOpen(false)
    onEndEdit()
  }

  if (isEditing || isOpen) {
    return (
      <Popover
        open={isOpen || isEditing}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) onEndEdit()
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-8 text-sm justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, 'MMM dd, yyyy') : 'Select date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={dateValue || undefined} onSelect={handleSelect} initialFocus />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div
      className="cursor-pointer hover:bg-gray-100 rounded px-2 py-1 text-sm"
      onClick={onStartEdit}
    >
      {dateValue ? format(dateValue, 'MMM dd, yyyy') : <span className="text-gray-400">No date</span>}
    </div>
  )
}

