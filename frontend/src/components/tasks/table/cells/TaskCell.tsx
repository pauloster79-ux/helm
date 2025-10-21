/**
 * TaskCell Component
 * 
 * Task title cell with hierarchy, expand/collapse, and inline editing with AI
 */

import { useState, useRef, useEffect } from 'react'
import { ChevronRight, ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAIValidation } from '@/hooks/useAIValidation'
import AIInlineSuggestionPopover from '@/components/tasks/table/AIInlineSuggestionPopover'
import type { Task } from '@/types/database.types'

interface TaskCellProps {
  task: Task
  level: number
  hasChildren: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  onEdit: (newTitle: string) => Promise<void>
  isEditing: boolean
  onStartEdit: () => void
  onEndEdit: () => void
  projectId: string
}

export default function TaskCell({
  task,
  level,
  hasChildren,
  isExpanded,
  onToggleExpand,
  onEdit,
  isEditing,
  onStartEdit,
  onEndEdit,
  projectId,
}: TaskCellProps) {
  const [editValue, setEditValue] = useState(task.title)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cellRef = useRef<HTMLDivElement>(null)

  // AI validation for title field
  const { isAnalyzing, suggestions, issues, validate, clear } = useAIValidation({
    projectId,
    componentType: 'task',
    componentId: task.id,
    enabled: isEditing,
    debounceMs: 1000,
  })

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    if (isEditing) {
      validate('title', editValue)
    }
  }, [editValue, isEditing, validate])

  // Auto-show suggestions when available
  useEffect(() => {
    if (suggestions.length > 0 && !isAnalyzing && isEditing) {
      setShowSuggestions(true)
    }
  }, [suggestions.length, isAnalyzing, isEditing])

  const handleSave = async () => {
    if (editValue.trim() && editValue !== task.title) {
      await onEdit(editValue.trim())
    }
    clear()
    onEndEdit()
  }

  const handleCancel = () => {
    setEditValue(task.title)
    clear()
    onEndEdit()
  }

  const handleApplySuggestion = (proposal: any) => {
    setEditValue(proposal.proposed_value)
    setShowSuggestions(false)
  }

  const handleDismissSuggestion = () => {
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  return (
    <div ref={cellRef} className="flex items-center gap-2 py-1">
      {/* Indentation */}
      <div style={{ width: `${level * 24}px` }} className="flex-shrink-0" />

      {/* Expand/collapse button */}
      {hasChildren ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      ) : (
        <div className="w-5" />
      )}

      {/* Title display or edit mode */}
      {isEditing ? (
        <div className="flex-1 relative">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="h-8"
            />
            {/* Sparkle icon for AI suggestions */}
            {(isAnalyzing || suggestions.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSuggestions(!showSuggestions)
                }}
              >
                <Sparkles
                  className={`h-4 w-4 ${
                    isAnalyzing ? 'text-blue-500 animate-pulse' : 'text-amber-500'
                  }`}
                />
              </Button>
            )}
          </div>

          {/* AI Suggestion Popover */}
          <AIInlineSuggestionPopover
            isOpen={showSuggestions}
            onOpenChange={setShowSuggestions}
            anchorEl={cellRef.current}
            suggestions={suggestions}
            issues={issues}
            isAnalyzing={isAnalyzing}
            onApply={handleApplySuggestion}
            onDismiss={handleDismissSuggestion}
          />
        </div>
      ) : (
        <div
          className={`flex-1 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 ${
            hasChildren ? 'font-semibold' : ''
          }`}
          onClick={onStartEdit}
        >
          {task.title}
        </div>
      )}
    </div>
  )
}

