import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import type { Project } from '@/types/database.types'

interface ProjectCardProps {
  project: Project
  onViewProject: (projectId: string) => void
  onDeleteProject: (projectId: string) => void
  isDeleting?: boolean
}

export default function ProjectCard({ 
  project, 
  onViewProject, 
  onDeleteProject,
  isDeleting = false
}: ProjectCardProps) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
      month: 'short',
      day: 'numeric'
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return formatDate(dateString)
  }

  const handleDelete = () => {
    onDeleteProject(project.id)
    setShowDeleteConfirm(false)
  }


  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {project.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            {/* Status Badge */}
            <Badge variant="outline" className={getStatusColor(project.status)}>
              <span className="mr-1">{getStatusIcon(project.status)}</span>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                title="Delete project"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 w-full">
          <div className="flex items-center gap-4">
            <span>Created {formatRelativeDate(project.created_at)}</span>
            {project.updated_at !== project.created_at && (
              <span>Updated {formatRelativeDate(project.updated_at)}</span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/projects/${project.id}/overview`)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View Project →
          </Button>
        </div>
      </CardFooter>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone and will also delete all associated tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-helm-red hover:bg-helm-red/90 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}