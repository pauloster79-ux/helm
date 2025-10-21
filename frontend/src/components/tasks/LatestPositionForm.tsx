import { useState } from 'react'
import type { LatestPositionEntry, LatestPositionFormData, LatestPositionFormErrors } from '@/types/database.types'
import { Button } from '@/components/ui/button'

interface LatestPositionFormProps {
  onSubmit: (data: LatestPositionFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  existingPositions?: LatestPositionEntry[]
}

export default function LatestPositionForm({
  onSubmit,
  onCancel,
  loading = false,
  existingPositions = []
}: LatestPositionFormProps) {
  const [formData, setFormData] = useState<LatestPositionFormData>({
    content: ''
  })
  const [errors, setErrors] = useState<LatestPositionFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: LatestPositionFormErrors = {}

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Progress update is required'
    } else if (formData.content.length < 3) {
      newErrors.content = 'Progress update must be at least 3 characters'
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Progress update must be 5000 characters or less'
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
      await onSubmit(formData)
      setFormData({ content: '' }) // Clear form after successful submission
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ general: 'Failed to add progress update. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, content: value }))
    
    // Clear error when user starts typing
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const isFormValid = formData.content.trim().length >= 3 && 
                     formData.content.length <= 5000

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add Progress Update
      </h3>
      
      {errors.general && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Recent Updates */}
      {existingPositions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Updates</h4>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {existingPositions.slice(-3).reverse().map((position) => (
              <div key={position.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-800 mb-1">{position.content}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(position.created_at)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Progress Update *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.content ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe what you've accomplished, any blockers, or next steps..."
            maxLength={5000}
            disabled={isSubmitting || loading}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.content.length}/5000 characters
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting || loading}
            size="sm"
            className="flex-1"
          >
            {isSubmitting ? 'Adding...' : 'Add Update'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || loading}
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tips for effective progress updates:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Be specific about what you accomplished</li>
              <li>Mention any blockers or challenges</li>
              <li>Include next steps or plans</li>
              <li>Update your progress percentage if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
