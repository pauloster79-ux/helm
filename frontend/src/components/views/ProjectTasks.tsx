import { useState, useEffect } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Project } from '@/types/database.types'
import TaskList from '@/components/tasks/TaskList'
import TaskTable from '@/components/tasks/table/TaskTable'
// import DebugViewMode from '@/components/tasks/table/DebugViewMode'
import TaskForm from '@/components/tasks/TaskForm'
import TaskDetailModal from '@/components/tasks/TaskDetailModal'
import { Button } from '@/components/ui/button'
import DatabaseDebugger from '@/components/debug/DatabaseDebugger'

interface ProjectTasksProps {
  project: Project
}

export default function ProjectTasks({ project }: ProjectTasksProps) {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    addLatestPosition
  } = useTasks()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'table'>('list')

  // Fetch tasks when component mounts or project changes
  useEffect(() => {
    if (project.id) {
      fetchTasks(project.id)
    }
  }, [project.id, fetchTasks])

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(project.id, taskData)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId)
    setIsDetailModalOpen(true)
  }

  const handleTaskUpdate = async (taskId: string, updates: any) => {
    try {
      setIsUpdating(taskId)
      await updateTask(taskId, updates)
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    } finally {
      setIsUpdating(null)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      setIsDeleting(taskId)
      await deleteTask(taskId)
      if (selectedTask === taskId) {
        setIsDetailModalOpen(false)
        setSelectedTask(null)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleTaskStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status: status as 'todo' | 'in_progress' | 'review' | 'done' })
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleTaskProgressChange = async (taskId: string, progress: number) => {
    try {
      await updateTask(taskId, { progress_percentage: progress })
    } catch (error) {
      console.error('Error updating task progress:', error)
    }
  }

  const handleAddLatestPosition = async (taskId: string, content: string) => {
    try {
      return await addLatestPosition(taskId, content)
    } catch (error) {
      console.error('Error adding latest position:', error)
      throw error
    }
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTask(null)
  }

  const selectedTaskData = selectedTask ? tasks.find(t => t.id === selectedTask) : null

  // If create form is open, show only the form
  if (showCreateForm) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 mt-1">Add a new task to {project.name}</p>
        </div>

        {/* Debug Information */}
        <DatabaseDebugger projectId={project.id} />

        {/* Error Display - Database Schema Missing */}
        {error && error.includes('parent_task_id') && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 mb-1">Database Schema Update Required</p>
              <p className="text-xs text-yellow-700">
                The enhanced task management features require a database update. 
                Please apply the schema from <code className="bg-yellow-100 px-1 rounded">docs/architecture/PHASE_2B_TASK_SCHEMA_UPDATE.sql</code> in your Supabase SQL Editor.
              </p>
            </div>
          </div>
        )}
        {error && !error.includes('parent_task_id') && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Create Task Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TaskForm
            projectId={project.id}
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateForm(false)}
            availableParentTasks={tasks.filter(t => !t.parent_task_id)}
            availableOwners={[]} // TODO: Add team members when implemented
          />
        </div>
      </div>
    )
  }

  // Table view needs full height layout
  if (viewMode === 'table') {
    return (
      <div className="flex flex-col h-full min-h-0">
        {/* Compact header for table view */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{project.name} - Tasks</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                List
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-100 text-primary-700"
              >
                Table
              </button>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-helm-blue hover:bg-helm-blue/90 text-white"
          >
            + Add Task
          </Button>
        </div>

        {/* Table view - full height */}
        <div className="flex-1 overflow-hidden">
          <TaskTable
            tasks={tasks}
            project={project}
            loading={loading}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskClick={handleTaskClick}
            onCreateTask={handleCreateTask}
          />
        </div>

        {/* Task Detail Modal */}
        {selectedTaskData && (
          <TaskDetailModal
            task={selectedTaskData}
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            onUpdate={handleTaskUpdate}
            onDelete={handleTaskDelete}
            onAddLatestPosition={handleAddLatestPosition}
            isUpdating={isUpdating === selectedTask}
            isDeleting={isDeleting === selectedTask}
            availableParentTasks={tasks.filter((t) => t.id !== selectedTask && !t.parent_task_id)}
            availableOwners={[]}
          />
        )}
      </div>
    )
  }

  // Otherwise show the standard task list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage tasks for {project.name}</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-helm-blue hover:bg-helm-blue/90 text-white"
        >
          + Add Task
        </Button>
      </div>

      {/* Debug Information */}
      <DatabaseDebugger projectId={project.id} />

      {/* Error Display - Database Schema Missing */}
      {error && error.includes('parent_task_id') && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 mb-1">Database Schema Update Required</p>
            <p className="text-xs text-yellow-700">
              The enhanced task management features require a database update. 
              Please apply the schema from <code className="bg-yellow-100 px-1 rounded">docs/architecture/PHASE_2B_TASK_SCHEMA_UPDATE.sql</code> in your Supabase SQL Editor.
            </p>
          </div>
        </div>
      )}
      {error && !error.includes('parent_task_id') && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Connection Issue
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{error}</p>
                {tasks.length > 0 && (
                  <p className="mt-1">
                    <strong>Good news:</strong> Your tasks are still loading. This may be a temporary network issue.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('table')}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:text-gray-700"
          >
            Table
          </button>
        </div>
      </div>

      {/* Task List (Cards or List view) */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onTaskClick={handleTaskClick}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskStatusChange={handleTaskStatusChange}
        onTaskProgressChange={handleTaskProgressChange}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        showFilters={false}
        showSort={false}
        viewMode={viewMode === 'cards' ? 'cards' : 'list'}
        onViewModeChange={(mode) => setViewMode(mode as 'cards' | 'list')}
      />

      {/* Task Detail Modal */}
      {selectedTaskData && (
        <TaskDetailModal
          task={selectedTaskData}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          onAddLatestPosition={handleAddLatestPosition}
          isUpdating={isUpdating === selectedTask}
          isDeleting={isDeleting === selectedTask}
          availableParentTasks={tasks.filter(t => t.id !== selectedTask && !t.parent_task_id)}
          availableOwners={[]} // TODO: Add team members when implemented
        />
      )}
    </div>
  )
}
