import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProject } from '@/hooks/useProject'
import ProjectOverview from '@/components/views/ProjectOverview'
import ProjectTasks from '@/components/views/ProjectTasks'
import ProjectRisks from '@/components/views/ProjectRisks'
import ProjectTimeline from '@/components/views/ProjectTimeline'
import ProjectDocuments from '@/components/views/ProjectDocuments'
import ProjectDetailModal from '@/components/projects/ProjectDetailModal'

export default function ProjectPage() {
  const { projectId, view = 'overview' } = useParams<{ projectId: string; view?: string }>()
  const navigate = useNavigate()
  const { project, loading, updateProject, deleteProject } = useProject(projectId)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project Not Found</h3>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const handleEditProject = () => {
    setIsEditModalOpen(true)
  }

  const handleUpdateProject = async (_projectId: string, updates: any) => {
    try {
      setIsUpdating(true)
      await updateProject(updates)
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteProject = async (_projectId: string) => {
    try {
      setIsDeleting(true)
      await deleteProject()
      navigate('/projects')
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const renderView = () => {
    switch (view) {
      case 'tasks':
        return <ProjectTasks project={project} />
      case 'risks':
        return <ProjectRisks project={project} />
      case 'timeline':
        return <ProjectTimeline project={project} />
      case 'documents':
        return <ProjectDocuments project={{ id: project.id, name: project.name, description: project.description || undefined }} />
      case 'overview':
      default:
        return <ProjectOverview project={project} onEditProject={handleEditProject} />
    }
  }

  return (
    <>
      {renderView()}

      {/* Edit Project Modal */}
      <ProjectDetailModal
        project={project}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateProject}
        onDelete={handleDeleteProject}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </>
  )
}
