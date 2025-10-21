import { useState } from 'react'
import { useProjects } from '@/hooks/useProjects'
import ProjectForm from './ProjectForm'
import type { ProjectFormData } from '@/types/database.types'

interface CreateProjectFormProps {
  onProjectCreated: (project: any) => void
  onCancel: () => void
}

export default function CreateProjectForm({ onProjectCreated, onCancel }: CreateProjectFormProps) {
  const { createProject, error, clearError } = useProjects()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: ProjectFormData) => {
    try {
      setIsSubmitting(true)
      clearError()
      const newProject = await createProject(formData)
      onProjectCreated(newProject)
    } catch (error) {
      console.error('Error creating project:', error)
      // Error is handled by the useProjects hook and displayed in ProjectForm
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={isSubmitting}
        submitText="Create Project"
      />
    </div>
  )
}