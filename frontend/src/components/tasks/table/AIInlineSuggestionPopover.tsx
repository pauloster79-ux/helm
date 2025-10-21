/**
 * AIInlineSuggestionPopover Component
 * 
 * Popover wrapper for InlineSuggestion component used in table cells
 */

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { InlineSuggestion } from '@/components/ai/InlineSuggestion'
import type { AIProposal, ValidationIssue } from '@/types/database.types'

interface AIInlineSuggestionPopoverProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  anchorEl: HTMLElement | null
  suggestions: AIProposal[]
  issues: ValidationIssue[]
  isAnalyzing: boolean
  onApply: (proposal: AIProposal) => void
  onDismiss: (proposal: AIProposal) => void
}

export default function AIInlineSuggestionPopover({
  isOpen,
  onOpenChange,
  suggestions,
  issues,
  isAnalyzing,
  onApply,
  onDismiss,
}: AIInlineSuggestionPopoverProps) {
  // Don't render if no suggestions or issues and not analyzing
  if (!isAnalyzing && suggestions.length === 0 && issues.length === 0) {
    return null
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className="absolute inset-0 pointer-events-none" />
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-4"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        <InlineSuggestion
          proposals={suggestions}
          issues={issues}
          isAnalyzing={isAnalyzing}
          onApply={onApply}
          onDismiss={onDismiss}
        />
      </PopoverContent>
    </Popover>
  )
}

