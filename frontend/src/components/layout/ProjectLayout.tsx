import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import LeftNavigation from './LeftNavigation'
import CreateProjectForm from '../projects/CreateProjectForm'

interface ProjectLayoutProps {
  children: React.ReactNode
  selectedProjectId?: string | null
  onProjectSelect?: (projectId: string | null) => void
  onCreateProject?: () => void
  onViewAllProjects?: () => void
  activeView?: 'overview' | 'tasks' | 'risks' | 'timeline' | 'documents'
  onViewChange?: (view: 'overview' | 'tasks' | 'risks' | 'timeline' | 'documents') => void
  projects?: any[]
}

export default function ProjectLayout({ 
  children, 
  selectedProjectId, 
  onProjectSelect, 
  onCreateProject, 
  onViewAllProjects,
  activeView,
  onViewChange,
  projects: externalProjects
}: ProjectLayoutProps) {
  const navigate = useNavigate()
  const { projects: hookProjects } = useProjects()
  const projects = externalProjects || hookProjects
  const [selectedProject, setSelectedProject] = useState<string | null>(selectedProjectId || null)
  const [selectedView, setSelectedView] = useState<'overview' | 'tasks' | 'risks' | 'timeline' | 'documents'>(activeView || 'overview')
  const [showCreateProject, setShowCreateProject] = useState(false)

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProject(projectId)
    setSelectedView('overview') // Reset to overview when project changes
    onProjectSelect?.(projectId)
  }

  const handleViewSelect = (view: 'overview' | 'tasks' | 'risks' | 'timeline' | 'documents') => {
    setSelectedView(view)
    onViewChange?.(view)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Project Header */}
      {selectedProject && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {projects.find(p => p.id === selectedProject)?.name}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Projects
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Left Navigation */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <LeftNavigation
            selectedView={selectedView}
            onViewSelect={handleViewSelect}
            hasSelectedProject={!!selectedProject}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {showCreateProject ? (
            <CreateProjectForm
              onProjectCreated={() => {
                setShowCreateProject(false)
                // Optionally select the newly created project
              }}
              onCancel={() => setShowCreateProject(false)}
            />
          ) : (
            <div className="space-y-6">
              {/* Content Area */}
              {selectedProject ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {children}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
                  <p className="text-gray-600 mb-4">Go to Projects to select a project to work with</p>
                  <button
                    onClick={() => navigate('/projects')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    Go to Projects
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
