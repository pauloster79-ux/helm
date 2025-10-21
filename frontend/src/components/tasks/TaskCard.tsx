import { useState } from 'react'
import type { Task } from '@/types/database.types'

interface TaskCardProps {
  task: Task
  viewMode?: 'cards' | 'list'
  onClick: () => void
  onUpdate: (updates: any) => Promise<void>
  onDelete: () => Promise<void>
  onStatusChange: (status: string) => Promise<void>
  onProgressChange: (progress: number) => Promise<void>
  isUpdating?: boolean
  isDeleting?: boolean
}

export default function TaskCard({
  task,
  viewMode = 'cards',
  onClick,
  onUpdate,
  onDelete,
  onStatusChange,
  onProgressChange,
  isUpdating = false,
  isDeleting = false
}: TaskCardProps) {
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low': return '↓'
      case 'medium': return '→'
      case 'high': return '↑'
      default: return '→'
    }
  }

  const isEndingSoon = task.end_date && new Date(task.end_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && task.status !== 'done'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    try {
      await onStatusChange(e.target.value)
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleProgressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    try {
      await onProgressChange(Number(e.target.value))
    } catch (error) {
      console.error('Error updating task progress:', error)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await onDelete()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  if (viewMode === 'list') {
    return (
      <div 
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${
          isUpdating || isDeleting ? 'opacity-50' : ''
        }`}
        onClick={onClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {task.title}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)} {task.priority}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {task.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Progress: {task.progress_percentage}% (type: {typeof task.progress_percentage})</span>
              {task.estimated_hours && (
                <span>Est: {task.estimated_hours}h</span>
              )}
              {task.start_date && (
                <span>Start: {formatDate(task.start_date)}</span>
              )}
              {task.end_date && (
                <span className={isEndingSoon ? 'text-orange-600 font-medium' : ''}>
                  End: {formatDate(task.end_date)}
                </span>
              )}
              {task.parent_task_id && (
                <span className="text-blue-600">Subtask</span>
              )}
              {task.owner_id && (
                <span className="text-purple-600">Assigned</span>
              )}
              <span>Created: {formatDate(task.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {/* Progress Bar */}
            <div className="w-24">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${task.progress_percentage}%`,
                    backgroundColor: 'hsl(198.6, 88.7%, 48.4%)' // Fallback to helm-blue color
                  }}
                ></div>
              </div>
            </div>

            {/* Quick Actions */}
            {showActions && (
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={handleStatusChange}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>

                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 p-1"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Card view
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer ${
        isUpdating || isDeleting ? 'opacity-50' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)} {task.priority}
            </span>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 ml-2">
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="text-xs border border-gray-300 rounded px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>

            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 p-1"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
        {task.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{task.progress_percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${task.progress_percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2 text-xs text-gray-500">
        {task.estimated_hours && (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{task.estimated_hours}h estimated</span>
          </div>
        )}
        
        {task.start_date && (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Start {formatDate(task.start_date)}</span>
          </div>
        )}
        
        {task.end_date && (
          <div className={`flex items-center gap-1 ${isEndingSoon ? 'text-orange-600 font-medium' : ''}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>End {formatDate(task.end_date)}</span>
          </div>
        )}

        {task.parent_task_id && (
          <div className="flex items-center gap-1 text-blue-600">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Subtask</span>
          </div>
        )}

        {task.owner_id && (
          <div className="flex items-center gap-1 text-purple-600">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Assigned</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Created {formatDate(task.created_at)}</span>
        </div>
      </div>

      {/* Overdue indicator */}
      {isOverdue && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">Overdue</span>
          </div>
        </div>
      )}
    </div>
  )
}
