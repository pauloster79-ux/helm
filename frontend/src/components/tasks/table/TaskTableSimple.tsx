/**
 * Simple TaskTable for testing
 */

import type { Task, Project } from '@/types/database.types'

interface TaskTableSimpleProps {
  tasks: Task[]
  project: Project
  loading?: boolean
  onTaskUpdate: (taskId: string, updates: any) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
  onTaskClick: (taskId: string) => void
}

export default function TaskTableSimple({
  tasks,
  project,
  loading = false,
  onTaskUpdate,
  onTaskDelete,
  onTaskClick,
}: TaskTableSimpleProps) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Simple Task Table</h2>
      <p className="text-gray-600 mb-4">Project: {project.name}</p>
      <p className="text-gray-600 mb-4">Tasks count: {tasks.length}</p>
      
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 border rounded bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="font-medium">{task.title}</span>
                <span className="text-sm text-gray-500">{task.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
