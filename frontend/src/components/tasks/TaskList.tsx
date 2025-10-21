import { useState } from 'react'
import type { Task, TaskFilters, TaskSortOptions } from '@/types/database.types'
import TaskCard from './TaskCard'
import TaskFiltersComponent from './TaskFilters'
import TaskSortComponent from './TaskSort'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TaskListProps {
  tasks: Task[]
  loading?: boolean
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: any) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
  onTaskStatusChange: (taskId: string, status: string) => Promise<void>
  onTaskProgressChange: (taskId: string, progress: number) => Promise<void>
  isUpdating?: string | null
  isDeleting?: string | null
  showFilters?: boolean
  showSort?: boolean
  viewMode?: 'cards' | 'list'
  onViewModeChange?: (mode: 'cards' | 'list') => void
}

export default function TaskList({
  tasks,
  loading = false,
  onTaskClick,
  onTaskUpdate,
  onTaskDelete,
  onTaskStatusChange,
  onTaskProgressChange,
  isUpdating = null,
  isDeleting = null,
  showFilters = true,
  showSort = true,
  viewMode = 'cards',
  onViewModeChange
}: TaskListProps) {
  const [filters, setFilters] = useState<TaskFilters>({})
  const [sort, setSort] = useState<TaskSortOptions>({
    field: 'created_at',
    direction: 'desc'
  })

  // Apply filters and sorting to tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(task.status)) return false
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) return false
      }

      // Owner filter
      if (filters.owner_id) {
        if (task.owner_id !== filters.owner_id) return false
      }

      // Parent task filter
      if (filters.parent_task_id !== undefined) {
        if (task.parent_task_id !== filters.parent_task_id) return false
      }

      // Progress filter
      if (filters.progress_min !== undefined) {
        if (task.progress_percentage < filters.progress_min) return false
      }
      if (filters.progress_max !== undefined) {
        if (task.progress_percentage > filters.progress_max) return false
      }

      // Start date filter
      if (filters.start_date_from && task.start_date) {
        if (new Date(task.start_date) < new Date(filters.start_date_from)) return false
      }
      if (filters.start_date_to && task.start_date) {
        if (new Date(task.start_date) > new Date(filters.start_date_to)) return false
      }

      // End date filter
      if (filters.end_date_from && task.end_date) {
        if (new Date(task.end_date) < new Date(filters.end_date_from)) return false
      }
      if (filters.end_date_to && task.end_date) {
        if (new Date(task.end_date) > new Date(filters.end_date_to)) return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!task.title.toLowerCase().includes(searchLower) && 
            !(task.description && task.description.toLowerCase().includes(searchLower))) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      let aValue: any = a[sort.field]
      let bValue: any = b[sort.field]

      // Handle date fields
      if (sort.field === 'created_at' || sort.field === 'updated_at' || sort.field === 'start_date' || sort.field === 'end_date') {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
      ending_soon: tasks.filter(t => t.end_date && new Date(t.end_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && t.status !== 'done').length
    }
    return stats
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do'
      case 'in_progress': return 'In Progress'
      case 'review': return 'Review'
      case 'done': return 'Done'
      default: return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const stats = getTaskStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Filters and Sort Controls */}
      {(showFilters || showSort) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {showFilters && (
              <div className="flex-1">
                <TaskFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            )}
            
            {showSort && (
              <div className="lg:w-64">
                <TaskSortComponent
                  sort={sort}
                  onSortChange={setSort}
                />
              </div>
            )}

          </div>
        </div>
      )}

      {/* Tasks Content */}
      {filteredAndSortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          </h3>
          <p className="text-gray-600">
            {tasks.length === 0 
              ? 'Get started by creating your first task'
              : 'Try adjusting your filters to see more tasks'
            }
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              viewMode={viewMode}
              onClick={() => onTaskClick(task.id)}
              onUpdate={(updates) => onTaskUpdate(task.id, updates)}
              onDelete={() => onTaskDelete(task.id)}
              onStatusChange={(status) => onTaskStatusChange(task.id, status)}
              onProgressChange={(progress) => onTaskProgressChange(task.id, progress)}
              isUpdating={isUpdating === task.id}
              isDeleting={isDeleting === task.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-300">
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTasks.map((task) => (
                <TableRow 
                  key={task.id} 
                  className="cursor-pointer hover:bg-gray-50 border-gray-300"
                  onClick={() => onTaskClick(task.id)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {formatStatus(task.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${task.progress_percentage}%`,
                            backgroundColor: 'hsl(198.6, 88.7%, 48.4%)' // Fallback to helm-blue color
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{task.progress_percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.parent_task_id ? (
                      <span className="text-sm text-blue-600">Subtask</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.owner_id ? (
                      <span className="text-sm text-purple-600">Assigned</span>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.start_date ? (
                      <span className="text-sm text-gray-600">
                        {formatDate(task.start_date)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.end_date ? (
                      <span className="text-sm text-gray-600">
                        {formatDate(task.end_date)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(task.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskClick(task.id)
                        }}
                        disabled={isUpdating === task.id || isDeleting === task.id}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Results Summary */}
      {filteredAndSortedTasks.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  )
}
