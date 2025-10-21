import { useState } from 'react'
import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/types/database.types'

interface ProjectSelectorProps {
  selectedProjectId: string | null
  onProjectSelect: (projectId: string | null) => void
  onCreateProject: () => void
  onViewAllProjects: () => void
}

export default function ProjectSelector({
  selectedProjectId,
  onProjectSelect,
  onCreateProject,
  onViewAllProjects
}: ProjectSelectorProps) {
  const { projects, loading } = useProjects()
  const [isOpen, setIsOpen] = useState(false)

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const handleProjectSelect = (projectId: string | null) => {
    onProjectSelect(projectId)
    setIsOpen(false)
  }

  if (loading) {
    return (
      <div className="relative">
        <button
          disabled
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between text-gray-500"
        >
          <span>Loading projects...</span>
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      >
        <div className="flex items-center gap-3">
          {selectedProject ? (
            <>
              <span className="text-lg">{getStatusIcon(selectedProject.status)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {selectedProject.name}
                </div>
                <div className="text-sm text-gray-500">
                  {projects.length} project{projects.length !== 1 ? 's' : ''}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">Select a project</div>
              <div className="text-sm text-gray-500">
                {projects.length} project{projects.length !== 1 ? 's' : ''} available
              </div>
            </div>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            {projects.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-sm">No projects yet</div>
                <button
                  onClick={() => {
                    onCreateProject()
                    setIsOpen(false)
                  }}
                  className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              <>
                {/* Project List */}
                <div className="py-1">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 ${
                        selectedProjectId === project.id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <span className="text-lg">{getStatusIcon(project.status)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {project.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                          {project.description && (
                            <span className="text-xs text-gray-500 truncate">
                              {project.description}
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedProjectId === project.id && (
                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      onCreateProject()
                      setIsOpen(false)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-primary-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium">Create New Project</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onViewAllProjects()
                      setIsOpen(false)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="font-medium">View All Projects</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}