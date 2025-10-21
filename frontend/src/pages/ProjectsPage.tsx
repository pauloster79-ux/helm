import { useState } from 'react'
import { useProjects } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectsTable from '@/components/projects/ProjectsTable'
import ViewSelector, { ViewMode } from '@/components/projects/ViewSelector'
import CreateProjectForm from '@/components/projects/CreateProjectForm'
import ProjectDetailModal from '@/components/projects/ProjectDetailModal'
import SkeletonLoader from '@/components/common/SkeletonLoader'
import type { Project } from '@/types/database.types'

export default function ProjectsPage() {
  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    updateProject, 
    deleteProject, 
    clearError 
  } = useProjects()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  const handleCreateProject = async (projectData: any) => {
    try {
      await createProject(projectData)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleViewProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setIsDetailModalOpen(true)
    }
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

  const getProjectStats = () => {
    const stats = {
      total: projects.length,
      planning: projects.filter(p => p.status === 'planning').length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      archived: projects.filter(p => p.status === 'archived').length
    }
    return stats
  }

  const stats = getProjectStats()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-gray-600">Manage all your projects in one place</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-helm-blue hover:bg-helm-blue/90 text-white"
          >
            Create Project
          </Button>
        </div>
      </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-400 hover:text-red-600 h-auto p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        )}

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.planning}</div>
            <div className="text-sm text-gray-600">Planning</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
            <div className="text-sm text-gray-600">Archived</div>
          </div>
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateProjectForm
              onProjectCreated={handleCreateProject}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* View Selector */}
        <ViewSelector
          currentView={viewMode}
          onViewChange={setViewMode}
          projectCount={projects.length}
        />

        {/* Projects Content */}
        {loading ? (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonLoader variant="project-card" count={6} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <SkeletonLoader variant="table-row" count={5} />
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first project</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              size="sm"
              className="bg-helm-blue hover:bg-helm-blue/90 text-white"
            >
              Create Your First Project
            </Button>
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewProject={handleViewProject}
                    onDeleteProject={handleDeleteProject}
                    isDeleting={isDeleting === project.id}
                  />
                ))}
              </div>
            ) : (
              <ProjectsTable
                projects={projects}
                onViewProject={handleViewProject}
                onDeleteProject={handleDeleteProject}
                isDeleting={isDeleting}
              />
            )}
          </>
        )}

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
    </div>
  )
}