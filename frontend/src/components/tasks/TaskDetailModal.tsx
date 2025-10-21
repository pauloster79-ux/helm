import { useState, useEffect } from 'react'
import type { Task, TaskWithDetails, LatestPositionEntry, TaskFormData } from '@/types/database.types'
import TaskForm from './TaskForm'
import { Button } from '@/components/ui/button'

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (taskId: string, updates: any) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onAddLatestPosition: (taskId: string, content: string) => Promise<LatestPositionEntry[]>
  isUpdating?: boolean
  isDeleting?: boolean
  availableParentTasks?: Task[]
  availableOwners?: Array<{ id: string; full_name: string; email: string }>
}

export default function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onAddLatestPosition,
  isUpdating = false,
  isDeleting = false,
  availableParentTasks = [],
  availableOwners = []
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingUpdate, setIsAddingUpdate] = useState(false)
  const [updateContent, setUpdateContent] = useState('')
  const [taskDetails, setTaskDetails] = useState<TaskWithDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showAllUpdates, setShowAllUpdates] = useState(false)

  // Load task details when modal opens or task changes
  useEffect(() => {
    if (isOpen && task) {
      setLoadingDetails(true)
      setIsEditing(false)
      setIsAddingUpdate(false)
      setUpdateContent('')
      setShowAllUpdates(false)
      // In a real implementation, you'd fetch the full task details here
      // For now, we'll use the basic task data
      setTaskDetails({
        ...task,
        latest_position: task.latest_position as LatestPositionEntry[] || [],
        parent_task: null,
        subtasks: [],
        dependencies: [],
        owner: null
      })
      setLoadingDetails(false)
    }
  }, [isOpen, task])

  // Sync taskDetails when task prop changes (e.g., from external updates)
  useEffect(() => {
    if (task && taskDetails) {
      setTaskDetails(prev => prev ? { ...prev, ...task } : null)
    }
  }, [task])

  if (!isOpen || !task) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do'
      case 'in_progress': return 'In Progress'
      case 'review': return 'Review'
      case 'done': return 'Done'
      default: return status
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const isEndingSoon = (taskDetails?.end_date || task.end_date) && new Date(taskDetails?.end_date || task.end_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (taskDetails?.status || task.status) !== 'done'

  const handleUpdate = async (updates: TaskFormData) => {
    try {
      await onUpdate(task.id, updates)
      // Update local state
      setTaskDetails(prev => prev ? { ...prev, ...updates } : null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const handleAddUpdate = async () => {
    if (!updateContent.trim() || updateContent.length < 3) {
      console.warn('⚠️ Update content is too short')
      return
    }
    
    try {
      console.log('📝 TaskDetailModal: Starting to add update...')
      setIsAddingUpdate(true)
      const updatedPositions = await onAddLatestPosition(task.id, updateContent)
      console.log('✅ TaskDetailModal: Update successful, positions:', updatedPositions)
      setTaskDetails(prev => prev ? { ...prev, latest_position: updatedPositions } : null)
      setUpdateContent('')
    } catch (error) {
      console.error('❌ TaskDetailModal: Error adding update:', error)
      alert(`Failed to add update: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsAddingUpdate(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await onDelete(task.id)
        onClose()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {taskDetails?.title || task.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(taskDetails?.status || task.status)}`}>
                  {formatStatus(taskDetails?.status || task.status)}
                </span>
                <span className={`text-sm font-medium ${getPriorityColor(taskDetails?.priority || task.priority)}`}>
                  {getPriorityIcon(taskDetails?.priority || task.priority)} {taskDetails?.priority || task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="sm"
                    className="bg-helm-blue hover:bg-helm-blue/90 text-white"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50"
                  title="Delete task"
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-2"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {loadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Task Details Section */}
                {isEditing ? (
                  <div className="pb-6 border-b border-gray-200">
                    <TaskForm
                      task={task}
                      projectId={task.project_id}
                      onSubmit={handleUpdate}
                      onCancel={() => setIsEditing(false)}
                      loading={isUpdating}
                      submitText="Update Task"
                      availableParentTasks={availableParentTasks}
                      availableOwners={availableOwners}
                    />
                  </div>
                ) : (
                  <div className="space-y-6 pb-6 border-b border-gray-200">
                    {/* Description */}
                    {(taskDetails?.description || task.description) && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-900 whitespace-pre-wrap">{taskDetails?.description || task.description}</p>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Progress</h4>
                        <span className="text-sm font-medium text-gray-900">{taskDetails?.progress_percentage || task.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${taskDetails?.progress_percentage || task.progress_percentage}%`,
                            backgroundColor: 'hsl(198.6, 88.7%, 48.4%)' // Fallback to helm-blue color
                          }}
                        ></div>
                      </div>
                      {/* Debug info */}
                      <div className="text-xs text-gray-500 mt-1">
                        Debug: taskDetails={JSON.stringify(taskDetails?.progress_percentage)}, task={JSON.stringify(task.progress_percentage)}
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Task Information</h4>
                        <dl className="space-y-2.5">
                          <div>
                            <dt className="text-xs text-gray-500">Status</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">{formatStatus(taskDetails?.status || task.status)}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Priority</dt>
                            <dd className={`text-sm font-medium mt-0.5 ${getPriorityColor(taskDetails?.priority || task.priority)}`}>
                              {getPriorityIcon(taskDetails?.priority || task.priority)} {taskDetails?.priority || task.priority}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Estimated Hours</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">
                              {(taskDetails?.estimated_hours || task.estimated_hours) ? `${taskDetails?.estimated_hours || task.estimated_hours}h` : 'Not specified'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Start Date</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">
                              {(taskDetails?.start_date || task.start_date) ? formatDate(taskDetails?.start_date || task.start_date) : 'Not set'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">End Date</dt>
                            <dd className={`text-sm mt-0.5 ${isEndingSoon ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                              {(taskDetails?.end_date || task.end_date) ? (
                                <>
                                  {formatDate(taskDetails?.end_date || task.end_date)}
                                  {isEndingSoon && ' (Ending Soon)'}
                                </>
                              ) : (
                                'Not set'
                              )}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Assigned To</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">
                              {task.owner_id ? 'Assigned' : 'Unassigned'}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline</h4>
                        <dl className="space-y-2.5">
                          <div>
                            <dt className="text-xs text-gray-500">Created</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">{formatDateTime(taskDetails?.created_at || task.created_at)}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Last Updated</dt>
                            <dd className="text-sm text-gray-900 mt-0.5">{formatDateTime(taskDetails?.updated_at || task.updated_at)}</dd>
                          </div>
                          {(taskDetails?.completed_at || task.completed_at) && (
                            <div>
                              <dt className="text-xs text-gray-500">Completed</dt>
                              <dd className="text-sm text-gray-900 mt-0.5">{formatDateTime(taskDetails?.completed_at || task.completed_at)}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                 {/* Latest Position Section */}
                <div>
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="text-sm font-medium text-gray-700">Latest Position</h4>
                    {taskDetails?.latest_position && taskDetails.latest_position.length > 3 && (
                      <button
                        onClick={() => setShowAllUpdates(!showAllUpdates)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {showAllUpdates ? 'Show less' : `View all (${taskDetails.latest_position.length})`}
                      </button>
                    )}
                  </div>

                  {/* Add Update Form */}
                  <div className="mb-4">
                    <textarea
                      value={updateContent}
                      onChange={(e) => setUpdateContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                       placeholder="Add a latest position update... (e.g., what you've accomplished, blockers, next steps)"
                      maxLength={5000}
                      disabled={isAddingUpdate}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {updateContent.length}/5000 characters
                      </p>
                      <Button
                        onClick={handleAddUpdate}
                        disabled={!updateContent.trim() || updateContent.length < 3 || isAddingUpdate}
                        size="sm"
                        className="bg-helm-green hover:bg-helm-green/90 text-white"
                      >
                        {isAddingUpdate ? 'Adding...' : 'Add Update'}
                      </Button>
                    </div>
                  </div>

                  {/* Updates Timeline */}
                  {taskDetails?.latest_position && taskDetails.latest_position.length > 0 ? (
                    <div className="space-y-3">
                      {(showAllUpdates 
                        ? taskDetails.latest_position 
                        : taskDetails.latest_position.slice(-3)
                      ).reverse().map((position, index) => (
                        <div key={position.id} className="relative pl-6">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full"></div>
                          {/* Timeline line */}
                          {index !== (showAllUpdates ? taskDetails.latest_position.length - 1 : Math.min(3, taskDetails.latest_position.length) - 1) && (
                            <div className="absolute left-0.5 top-4 w-px h-full bg-gray-200"></div>
                          )}
                          {/* Update content */}
                          <div className="pb-4">
                            <p className="text-sm text-gray-800 mb-1">{position.content}</p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(position.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                       <p>No latest position updates yet</p>
                       <p className="text-xs mt-1">Add your first update above to track progress</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
