import { useState, useEffect } from 'react'
import type { Project, ProjectFormData } from '@/types/database.types'
import ProjectForm from './ProjectForm'

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (projectId: string, updates: Partial<ProjectFormData>) => Promise<void>
  onDelete: (projectId: string) => Promise<void>
  isUpdating?: boolean
  isDeleting?: boolean
}

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false
}: ProjectDetailModalProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  useEffect(() => {
    if (isOpen) {
      setMode('view')
    }
  }, [isOpen])

  if (!isOpen || !project) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return '📋'
      case 'active':
        return '🚀'
      case 'completed':
        return '✅'
      case 'archived':
        return '📦'
      default:
        return '📋'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleUpdate = async (formData: ProjectFormData) => {
    await onUpdate(project.id, formData)
    setMode('view')
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      await onDelete(project.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'view' ? 'Project Details' : 'Edit Project'}
          </h2>
          <div className="flex items-center gap-2">
            {mode === 'view' && (
              <>
                <button
                  onClick={() => setMode('edit')}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit project"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete project"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {mode === 'view' ? (
            <div className="space-y-6">
              {/* Project Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{project.name}</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(project.status)}`}>
                    <span className="mr-1">{getStatusIcon(project.status)}</span>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                
                {project.description && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
                  </div>
                )}
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Created</h4>
                  <p className="text-gray-900">{formatDate(project.created_at)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h4>
                  <p className="text-gray-900">{formatDate(project.updated_at)}</p>
                </div>
              </div>

              {/* Project ID (for debugging) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Project ID</h4>
                <p className="text-xs text-gray-500 font-mono">{project.id}</p>
              </div>
            </div>
          ) : (
            <ProjectForm
              project={project}
              onSubmit={handleUpdate}
              onCancel={() => setMode('view')}
              loading={isUpdating}
              submitText="Update Project"
            />
          )}
        </div>
      </div>
    </div>
  )
}
