import { useState, useEffect } from 'react'
import type { Project, ProjectFormData, ProjectFormErrors } from '@/types/database.types'
import { Button } from '@/components/ui/button'

interface ProjectFormProps {
  project?: Project | null
  onSubmit: (data: ProjectFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitText?: string
}

export default function ProjectForm({ 
  project, 
  onSubmit, 
  onCancel, 
  loading = false,
  submitText = 'Create Project'
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'planning'
  })
  const [errors, setErrors] = useState<ProjectFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with project data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status
      })
    }
  }, [project])

  const validateForm = (): boolean => {
    const newErrors: ProjectFormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Project name must be 100 characters or less'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Project name must be at least 2 characters'
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less'
    }

    // Status validation
    const validStatuses = ['planning', 'active', 'completed', 'archived']
    if (!validStatuses.includes(formData.status)) {
      newErrors.status = 'Invalid project status'
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
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ general: 'Failed to save project. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof ProjectFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const isFormValid = formData.name.trim().length >= 2 && 
                     formData.name.length <= 100 && 
                     (!formData.description || formData.description.length <= 500)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {project ? 'Edit Project' : 'Create New Project'}
      </h3>
      
      {errors.general && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter project name"
            maxLength={100}
            disabled={isSubmitting || loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.name.length}/100 characters
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe your project (optional)"
            maxLength={500}
            disabled={isSubmitting || loading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 characters
          </p>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.status ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting || loading}
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting || loading}
            size="sm"
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : submitText}
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
    </div>
  )
}
