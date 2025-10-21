/**
 * LatestPositionPanel Component
 * 
 * Side panel showing latest position history for a task (read-only in MVP)
 */

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import type { Task, LatestPositionEntry } from '@/types/database.types'

interface LatestPositionPanelProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export default function LatestPositionPanel({
  task,
  isOpen,
  onClose,
}: LatestPositionPanelProps) {
  if (!task) return null

  // Parse latest_position from JSONB
  let positions: LatestPositionEntry[] = []
  try {
    if (task.latest_position && Array.isArray(task.latest_position)) {
      positions = task.latest_position as unknown as LatestPositionEntry[]
    } else if (task.latest_position && typeof task.latest_position === 'object') {
      // If it's a single object, wrap in array
      positions = [task.latest_position as unknown as LatestPositionEntry]
    }
  } catch (err) {
    console.error('Error parsing latest position:', err)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Latest Position: {task.title}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          {positions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No position updates yet</p>
              <p className="text-xs text-gray-400 mt-2">
                Use the detail view to add position updates
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {positions
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((position, index) => (
                  <div
                    key={position.id || index}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Update
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(position.created_at), 'MMM dd, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {position.content}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
          <p className="text-xs text-gray-500 text-center">
            This is a read-only view. Use "View Details" to add updates.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

