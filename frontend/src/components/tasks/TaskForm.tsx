import { useState, useEffect } from 'react'
import type { Task, TaskFormData, TaskFormErrors } from '@/types/database.types'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { Button } from '@/components/ui/button'
import { useAIValidation } from '@/hooks/useAIValidation'
import { InlineSuggestion } from '@/components/ai/InlineSuggestion'

interface TaskFormProps {
  task?: Task | null
  projectId: string
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitText?: string
  availableParentTasks?: Task[]
  availableOwners?: Array<{ id: string; full_name: string; email: string }>
}

export default function TaskForm({ 
  task, 
  projectId,
  onSubmit, 
  onCancel, 
  loading = false,
  submitText = 'Create Task',
  availableParentTasks = [],
  availableOwners = []
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    estimated_hours: null,
    progress_percentage: 0,
    parent_task_id: null,
    owner_id: null,
    start_date: null,
    end_date: null
  })
  const [errors, setErrors] = useState<TaskFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // AI Validation
  const { 
    isAnalyzing, 
    suggestions, 
    issues,
    validate,
    validateAll 
  } = useAIValidation({
    projectId: projectId,
    componentType: 'task',
    componentId: task?.id,
    enabled: true,
    debounceMs: 1000
  })

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        estimated_hours: task.estimated_hours,
        progress_percentage: task.progress_percentage,
        parent_task_id: task.parent_task_id,
        owner_id: task.owner_id,
        start_date: task.start_date ? new Date(task.start_date) : null,
        end_date: task.end_date ? new Date(task.end_date) : null
      })
    }
  }, [task])

  // AI Proposal handlers
  const handleApplySuggestion = (proposal: any) => {
    if (proposal.field === 'title') {
      setFormData(prev => ({ ...prev, title: proposal.proposed_value }));
    } else if (proposal.field === 'description') {
      setFormData(prev => ({ ...prev, description: proposal.proposed_value }));
    } else if (proposal.field === 'priority') {
      setFormData(prev => ({ ...prev, priority: proposal.proposed_value }));
    } else if (proposal.field === 'owner_id') {
      setFormData(prev => ({ ...prev, owner_id: proposal.proposed_value }));
    } else if (proposal.field === 'start_date') {
      const dateValue = typeof proposal.proposed_value === 'string' 
        ? new Date(proposal.proposed_value) 
        : proposal.proposed_value;
      setFormData(prev => ({ ...prev, start_date: dateValue }));
    } else if (proposal.field === 'end_date') {
      const dateValue = typeof proposal.proposed_value === 'string' 
        ? new Date(proposal.proposed_value) 
        : proposal.proposed_value;
      setFormData(prev => ({ ...prev, end_date: dateValue }));
    }
  };

  const handleDismissSuggestion = (proposal: any) => {
    console.log('Dismissed AI suggestion:', proposal.rationale);
  };

  const validateForm = (): boolean => {
    const newErrors: TaskFormErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Task title must be at least 3 characters'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Task title must be 200 characters or less'
    }

    // Description validation (optional but has max length)
    if (formData.description.length > 5000) {
      newErrors.description = 'Task description must be 5000 characters or less'
    }

    // Status validation
    const validStatuses = ['todo', 'in_progress', 'review', 'done']
    if (!validStatuses.includes(formData.status)) {
      newErrors.status = 'Invalid task status'
    }

    // Priority validation
    const validPriorities = ['low', 'medium', 'high']
    if (!validPriorities.includes(formData.priority)) {
      newErrors.priority = 'Invalid task priority'
    }

    // Progress validation
    if (formData.progress_percentage !== undefined) {
      if (formData.progress_percentage < 0 || formData.progress_percentage > 100) {
        newErrors.progress_percentage = 'Progress must be between 0 and 100'
      }
    }

    // Estimated hours validation
    if (formData.estimated_hours !== undefined && formData.estimated_hours !== null) {
      if (formData.estimated_hours < 0) {
        newErrors.estimated_hours = 'Estimated hours cannot be negative'
      } else if (formData.estimated_hours > 10000) {
        newErrors.estimated_hours = 'Estimated hours cannot exceed 10,000'
      }
    }

    // Date validation
    if (formData.start_date && formData.end_date) {
      if (formData.end_date < formData.start_date) {
        newErrors.end_date = 'End date must be after start date'
      }
    }

    // Parent task validation (prevent self-reference)
    if (formData.parent_task_id && task && formData.parent_task_id === task.id) {
      newErrors.parent_task_id = 'Task cannot be its own parent'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      // Run AI validation on all form data before submission
      await validateAll({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        owner_id: formData.owner_id,
        start_date: formData.start_date ? formData.start_date.toISOString().split('T')[0] : null,
        end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
        status: formData.status
      })
      
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ general: 'Failed to save task. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let processedValue: any = value

    // Handle number inputs
    if (name === 'estimated_hours' || name === 'progress_percentage') {
      processedValue = value === '' ? null : Number(value)
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof TaskFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }

    // Trigger AI validation for relevant fields
    if (['title', 'description', 'priority', 'owner_id'].includes(name)) {
      validate(name, processedValue)
    }
  }

  const isFormValid = formData.title.trim().length >= 3 && 
                     formData.title.length <= 200 &&
                     formData.description.length <= 5000 &&
                     (formData.progress_percentage === undefined || (formData.progress_percentage >= 0 && formData.progress_percentage <= 100)) &&
                     (formData.estimated_hours === null || formData.estimated_hours === undefined || (formData.estimated_hours >= 0 && formData.estimated_hours <= 10000))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div className="max-w-[500px]">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter task title"
            maxLength={200}
            disabled={isSubmitting || loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/200 characters
          </p>
          
          {/* AI Inline Suggestions for Title */}
          <InlineSuggestion
            proposals={suggestions.filter(s => s.field === 'title')}
            issues={issues.filter(i => i.field === 'title')}
            isAnalyzing={isAnalyzing}
            onApply={handleApplySuggestion}
            onDismiss={handleDismissSuggestion}
          />
        </div>

        {/* Description */}
        <div className="max-w-[700px]">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={errors.description ? 'border-red-300' : ''}
            placeholder="Describe the task in detail"
            maxLength={5000}
            disabled={isSubmitting || loading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/5000 characters
          </p>
          
          {/* AI Inline Suggestions for Description */}
          <InlineSuggestion
            proposals={suggestions.filter(s => s.field === 'description')}
            issues={issues.filter(i => i.field === 'description')}
            isAnalyzing={isAnalyzing}
            onApply={handleApplySuggestion}
            onDismiss={handleDismissSuggestion}
          />
        </div>

        {/* Status and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[650px]">
          <div className="max-w-[300px]">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${
                errors.status ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting || loading}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>

          <div className="max-w-[300px]">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${
                errors.priority ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting || loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
            )}
            
            {/* AI Inline Suggestions for Priority */}
            <InlineSuggestion
              proposals={suggestions.filter(s => s.field === 'priority')}
              issues={issues.filter(i => i.field === 'priority')}
              isAnalyzing={isAnalyzing}
              onApply={handleApplySuggestion}
              onDismiss={handleDismissSuggestion}
            />
          </div>
        </div>

        {/* Progress and Estimated Hours Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[370px]">
          <div className="max-w-[120px]">
            <label htmlFor="progress_percentage" className="block text-sm font-medium text-gray-700 mb-1">
              Progress (%)
            </label>
            <input
              type="number"
              id="progress_percentage"
              name="progress_percentage"
              value={formData.progress_percentage || ''}
              onChange={handleChange}
              min="0"
              max="100"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.progress_percentage ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
              disabled={isSubmitting || loading}
            />
            {errors.progress_percentage && (
              <p className="mt-1 text-sm text-red-600">{errors.progress_percentage}</p>
            )}
          </div>

          <div className="max-w-[200px]">
            <label htmlFor="estimated_hours" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              id="estimated_hours"
              name="estimated_hours"
              value={formData.estimated_hours || ''}
              onChange={handleChange}
              min="0"
              max="10000"
              step="0.5"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.estimated_hours ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Optional"
              disabled={isSubmitting || loading}
            />
            {errors.estimated_hours && (
              <p className="mt-1 text-sm text-red-600">{errors.estimated_hours}</p>
            )}
          </div>
        </div>

        {/* Parent Task and Owner Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[650px]">
          <div className="max-w-[300px]">
            <label htmlFor="parent_task_id" className="block text-sm font-medium text-gray-700 mb-1">
              Parent Task
            </label>
            <select
              id="parent_task_id"
              name="parent_task_id"
              value={formData.parent_task_id || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${
                errors.parent_task_id ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting || loading}
            >
              <option value="">No parent task</option>
              {availableParentTasks.map((parentTask) => (
                <option key={parentTask.id} value={parentTask.id}>
                  {parentTask.title}
                </option>
              ))}
            </select>
            {errors.parent_task_id && (
              <p className="mt-1 text-sm text-red-600">{errors.parent_task_id}</p>
            )}
          </div>

          <div className="max-w-[300px]">
            <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              id="owner_id"
              name="owner_id"
              value={formData.owner_id || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${
                errors.owner_id ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting || loading}
            >
              <option value="">Unassigned</option>
              {availableOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.full_name || owner.email}
                </option>
              ))}
            </select>
            {errors.owner_id && (
              <p className="mt-1 text-sm text-red-600">{errors.owner_id}</p>
            )}
            
            {/* AI Inline Suggestions for Assignee */}
            <InlineSuggestion
              proposals={suggestions.filter(s => s.field === 'owner_id')}
              issues={issues.filter(i => i.field === 'owner_id')}
              isAnalyzing={isAnalyzing}
              onApply={handleApplySuggestion}
              onDismiss={handleDismissSuggestion}
            />
          </div>
        </div>

        {/* Start Date and End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[500px]">
          <div className="max-w-[240px]">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              value={formData.start_date || undefined}
              onChange={(date) => {
                setFormData(prev => ({ ...prev, start_date: date || null }));
                // Trigger AI validation for start date
                validate('start_date', date ? date.toISOString().split('T')[0] : null);
              }}
              placeholder="Select start date"
              disabled={isSubmitting || loading}
              className={errors.start_date ? 'border-red-300' : ''}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
            )}
            
            {/* AI Inline Suggestions for Start Date */}
            <InlineSuggestion
              proposals={suggestions.filter(s => s.field === 'start_date')}
              issues={issues.filter(i => i.field === 'start_date')}
              isAnalyzing={isAnalyzing}
              onApply={handleApplySuggestion}
              onDismiss={handleDismissSuggestion}
            />
          </div>

          <div className="max-w-[240px]">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              value={formData.end_date || undefined}
              onChange={(date) => {
                setFormData(prev => ({ ...prev, end_date: date || null }));
                // Trigger AI validation for end date
                validate('end_date', date ? date.toISOString().split('T')[0] : null);
              }}
              placeholder="Select end date"
              disabled={isSubmitting || loading}
              className={errors.end_date ? 'border-red-300' : ''}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
            )}
            
            {/* AI Inline Suggestions for End Date */}
            <InlineSuggestion
              proposals={suggestions.filter(s => s.field === 'end_date')}
              issues={issues.filter(i => i.field === 'end_date')}
              isAnalyzing={isAnalyzing}
              onApply={handleApplySuggestion}
              onDismiss={handleDismissSuggestion}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting || loading}
          className="bg-helm-green hover:bg-helm-green/90 text-white"
        >
          {isSubmitting ? 'Saving...' : submitText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || loading}
          className="border-helm-grey text-helm-grey hover:bg-helm-grey hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
