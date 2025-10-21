/**
 * ProgressCell Component
 * 
 * Progress bar with inline slider editor in popover
 */

import { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ProgressCellProps {
  progress: number
  onUpdate: (progress: number) => Promise<void>
  isEditing: boolean
  onStartEdit: () => void
  onEndEdit: () => void
}

export default function ProgressCell({
  progress,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
}: ProgressCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(progress)

  const handleSave = async () => {
    await onUpdate(value)
    setIsOpen(false)
    onEndEdit()
  }

  const handleCancel = () => {
    setValue(progress)
    setIsOpen(false)
    onEndEdit()
  }

  if (isEditing || isOpen) {
    return (
      <Popover
        open={isOpen || isEditing}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) handleCancel()
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-8 w-full justify-start px-2">
            <div className="flex items-center gap-2 w-full">
              <Progress value={value} className="flex-1" />
              <span className="text-xs text-gray-600">{value}%</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Progress: {value}%</label>
              <Slider
                value={[value]}
                onValueChange={([v]) => setValue(v)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div
      className="cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
      onClick={onStartEdit}
    >
      <div className="flex items-center gap-2">
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-xs text-gray-600 w-8">{progress}%</span>
      </div>
    </div>
  )
}

