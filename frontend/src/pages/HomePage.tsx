import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import MainLayout from '@/components/layout/MainLayout'
import ProjectOverview from '@/components/views/ProjectOverview'
import ProjectTasks from '@/components/views/ProjectTasks'
import ProjectRisks from '@/components/views/ProjectRisks'
import ProjectTimeline from '@/components/views/ProjectTimeline'
import CreateProjectForm from '@/components/projects/CreateProjectForm'
import ProjectDetailModal from '@/components/projects/ProjectDetailModal'
import type { Project } from '@/types/database.types'

type ViewType = 'overview' | 'tasks' | 'risks' | 'timeline'

export default function HomePage() {
  const navigate = useNavigate()
  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    updateProject, 
    deleteProject, 
    getProject,
    clearError 
  } = useProjects()
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<ViewType>('overview')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Auto-select first project if none selected
  const currentProject = selectedProjectId ? getProject(selectedProjectId) : null

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProjectId(projectId)
    setActiveView('overview') // Reset to overview when switching projects
  }

  const handleCreateProject = async (projectData: any) => {
    try {
      const newProject = await createProject(projectData)
      setSelectedProjectId(newProject.id)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleViewAllProjects = () => {
    navigate('/projects')
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setIsDetailModalOpen(true)
  }

  const handleUpdateProject = async (projectId: string, updates: any) => {
    try {
      setIsUpdating(true)
      await updateProject(projectId, updates)
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsDeleting(projectId)
      await deleteProject(projectId)
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null)
      }
      if (selectedProject?.id === projectId) {
        setIsDetailModalOpen(false)
        setSelectedProject(null)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedProject(null)
  }

  const renderView = () => {
    if (!currentProject) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No project selected</h3>
          <p className="text-gray-600 mb-6">Select a project from the dropdown above to get started</p>
          {projects.length === 0 && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Create Your First Project
            </button>
          )}
        </div>
      )
    }

    switch (activeView) {
      case 'overview':
        return <ProjectOverview project={currentProject} onEditProject={handleEditProject} />
      case 'tasks':
        return <ProjectTasks project={currentProject} />
      case 'risks':
        return <ProjectRisks project={currentProject} />
      case 'timeline':
        return <ProjectTimeline project={currentProject} />
      default:
        return <ProjectOverview project={currentProject} onEditProject={handleEditProject} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <MainLayout
      selectedProjectId={selectedProjectId}
      onProjectSelect={handleProjectSelect}
      onCreateProject={() => setShowCreateForm(true)}
      onViewAllProjects={handleViewAllProjects}
      activeView={activeView}
      onViewChange={setActiveView}
      projects={projects}
    >
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="mb-8">
          <CreateProjectForm
            onProjectCreated={handleCreateProject}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Main Content */}
      {renderView()}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onUpdate={handleUpdateProject}
        onDelete={handleDeleteProject}
        isUpdating={isUpdating}
        isDeleting={isDeleting === selectedProject?.id}
      />
    </MainLayout>
  )
}