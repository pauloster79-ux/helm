/**
 * TaskTable Component
 * 
 * Advanced spreadsheet-like table view for tasks with:
 * - TanStack Table for performance and features
 * - Hierarchical display with expand/collapse
 * - Inline editing with AI suggestions
 * - Virtual scrolling for large datasets
 * - Integration with AssistantPane
 */

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  ExpandedState,
  SortingState,
} from '@tanstack/react-table'
import type { Task, Project, TaskFormData } from '@/types/database.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import LatestPositionPanel from '@/components/tasks/LatestPositionPanel'
import TaskCell from './cells/TaskCell'
import OwnerCell from './cells/OwnerCell'
import DateCell from './cells/DateCell'
import StatusCell from './cells/StatusCell'
import ProgressCell from './cells/ProgressCell'
import ActionsCell from './cells/ActionsCell'
import TaskTableToolbar from './TaskTableToolbar'

interface TaskWithHierarchy extends Task {
  children?: TaskWithHierarchy[]
  level: number
}

interface TaskTableProps {
  tasks: Task[]
  project: Project
  loading?: boolean
  onTaskUpdate: (taskId: string, updates: any) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
  onTaskClick: (taskId: string) => void
  onCreateTask?: (taskData: TaskFormData) => Promise<void>
}

export default function TaskTable({
  tasks,
  project,
  loading = false,
  onTaskUpdate,
  onTaskDelete,
  onTaskClick,
  onCreateTask,
}: TaskTableProps) {
  // State
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [latestPositionTask, setLatestPositionTask] = useState<Task | null>(null)
  const [isLatestPositionOpen, setIsLatestPositionOpen] = useState(false)
  const [isCreatingNewTask, setIsCreatingNewTask] = useState(false)
  const [newTaskData, setNewTaskData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    progress_percentage: 0,
  })

  // Handle inline task creation
  const handleStartCreateTask = () => {
    setIsCreatingNewTask(true)
    setNewTaskData({
      title: '',
      description: '',
      status: 'todo' as const,
      priority: 'medium' as const,
      progress_percentage: 0,
    })
  }

  const handleCancelCreateTask = () => {
    setIsCreatingNewTask(false)
    setNewTaskData({})
  }

  const handleSaveNewTask = async () => {
    if (!onCreateTask || !newTaskData.title?.trim()) return
    
    try {
      await onCreateTask(newTaskData as TaskFormData)
      setIsCreatingNewTask(false)
      setNewTaskData({})
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveNewTask()
    } else if (e.key === 'Escape') {
      handleCancelCreateTask()
    }
  }

  // Build task hierarchy
  const hierarchicalTasks = useMemo(() => {
    return buildTaskHierarchy(tasks)
  }, [tasks])

  // Flatten hierarchy for table display
  const flattenedTasks = useMemo(() => {
    const flatten = (tasks: TaskWithHierarchy[], level = 0): TaskWithHierarchy[] => {
      return tasks.reduce<TaskWithHierarchy[]>((acc, task) => {
        acc.push({ ...task, level })
        if (task.children && task.children.length > 0) {
          acc.push(...flatten(task.children, level + 1))
        }
        return acc
      }, [])
    }
    return flatten(hierarchicalTasks)
  }, [hierarchicalTasks])

  // Column definitions
  const columns = useMemo<ColumnDef<TaskWithHierarchy>[]>(
    () => [
      // Checkbox column
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      // Task column with hierarchy
      {
        id: 'task',
        accessorKey: 'title',
        header: 'Task',
        cell: ({ row }) => (
          <div 
            className="p-2 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => setEditingCell({ taskId: row.original.id, field: 'title' })}
          >
            <TaskCell
              task={row.original}
              level={row.original.level}
              hasChildren={!!row.original.children && row.original.children.length > 0}
              isExpanded={row.getIsExpanded()}
              onToggleExpand={row.getToggleExpandedHandler()}
              onEdit={async (newTitle) => {
                await onTaskUpdate(row.original.id, { title: newTitle })
                setEditingCell(null)
              }}
              isEditing={editingCell?.taskId === row.original.id && editingCell?.field === 'title'}
              onStartEdit={() => setEditingCell({ taskId: row.original.id, field: 'title' })}
              onEndEdit={() => setEditingCell(null)}
              projectId={project.id}
            />
          </div>
        ),
        enableSorting: true,
        size: 400,
      },
      // Owner column
      {
        id: 'owner',
        accessorFn: (row) => row.owner_id,
        header: 'Owner',
        cell: ({ row }) => (
          <div 
            className="p-2 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => setEditingCell({ taskId: row.original.id, field: 'owner' })}
          >
            <OwnerCell
              task={row.original}
              onUpdate={async (ownerId: string | null) => {
                await onTaskUpdate(row.original.id, { owner_id: ownerId })
                setEditingCell(null)
              }}
              isEditing={editingCell?.taskId === row.original.id && editingCell?.field === 'owner'}
              onStartEdit={() => setEditingCell({ taskId: row.original.id, field: 'owner' })}
              onEndEdit={() => setEditingCell(null)}
            />
          </div>
        ),
        enableSorting: true,
        size: 120,
      },
      // Start Date column
      {
        id: 'startDate',
        accessorKey: 'start_date',
        header: 'Start',
        cell: ({ row }) => (
          <div 
            className="p-2 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => setEditingCell({ taskId: row.original.id, field: 'startDate' })}
          >
            <DateCell
              date={row.original.start_date}
              onUpdate={async (date: Date | null) => {
                await onTaskUpdate(row.original.id, { start_date: date?.toISOString() })
                setEditingCell(null)
              }}
              isEditing={editingCell?.taskId === row.original.id && editingCell?.field === 'startDate'}
              onStartEdit={() => setEditingCell({ taskId: row.original.id, field: 'startDate' })}
              onEndEdit={() => setEditingCell(null)}
            />
          </div>
        ),
        enableSorting: true,
        size: 100,
      },
      // End Date column
      {
        id: 'endDate',
        accessorKey: 'end_date',
        header: 'End',
        cell: ({ row }) => (
          <div 
            className="p-2 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => setEditingCell({ taskId: row.original.id, field: 'endDate' })}
          >
            <DateCell
              date={row.original.end_date}
              onUpdate={async (date: Date | null) => {
                await onTaskUpdate(row.original.id, { end_date: date?.toISOString() })
                setEditingCell(null)
              }}
              isEditing={editingCell?.taskId === row.original.id && editingCell?.field === 'endDate'}
              onStartEdit={() => setEditingCell({ taskId: row.original.id, field: 'endDate' })}
              onEndEdit={() => setEditingCell(null)}
            />
          </div>
        ),
        enableSorting: true,
        size: 100,
      },
      // Status column
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div 
            className="p-2 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => setEditingCell({ taskId: row.original.id, field: 'status' })}
          >
            <StatusCell
              status={row.original.status}
              onUpdate={async (status: 'todo' | 'in_progress' | 'review' | 'done') => {
                await onTaskUpdate(row.original.id, { status })
                setEditingCell(null)
              }}
              isEditing={editingCell?.taskId === row.original.id && editingCell?.field === 'status'}
              onStartEdit={() => setEditingCell({ taskId: row.original.id, field: 'status' })}
              onEndEdit={() => setEditingCell(null)}
            />
          </div>
        ),
        enableSorting: true,
        size: 80,
      },
      // Progress column
      {
        id: 'progress',
        accessorKey: 'progress_percentage',
        header: 'Progress',
        cell: ({ row }) => (
          <div 
            className="p-2 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => setEditingCell({ taskId: row.original.id, field: 'progress' })}
          >
            <ProgressCell
              progress={row.original.progress_percentage}
              onUpdate={async (progress: number) => {
                await onTaskUpdate(row.original.id, { progress_percentage: progress })
                setEditingCell(null)
              }}
              isEditing={editingCell?.taskId === row.original.id && editingCell?.field === 'progress'}
              onStartEdit={() => setEditingCell({ taskId: row.original.id, field: 'progress' })}
              onEndEdit={() => setEditingCell(null)}
            />
          </div>
        ),
        enableSorting: true,
        size: 80,
      },
      // Actions column
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <ActionsCell
            task={row.original}
            onView={() => onTaskClick(row.original.id)}
            onDelete={() => onTaskDelete(row.original.id)}
            onViewLatestPosition={() => {
              setLatestPositionTask(row.original)
              setIsLatestPositionOpen(true)
            }}
          />
        ),
        enableSorting: false,
        size: 40,
      },
    ],
    [editingCell, onTaskUpdate, onTaskDelete, onTaskClick, project.id]
  )

  // Initialize table
  const table = useReactTable({
    data: flattenedTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true
      const searchValue = filterValue.toLowerCase()
      const task = row.original
      return (
        task.title.toLowerCase().includes(searchValue) ||
        (task.description ? task.description.toLowerCase().includes(searchValue) : false)
      )
    },
    getRowCanExpand: (row) => !!row.original.children && row.original.children.length > 0,
    state: {
      expanded,
      sorting,
      rowSelection,
      globalFilter,
    },
  })

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
    <div className="flex h-full">
      {/* Main table area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <TaskTableToolbar
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          table={table}
          tasks={tasks}
        />

        {/* Table */}
        <div className="flex-1 overflow-auto bg-white border-t">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="font-semibold text-xs uppercase tracking-wide text-gray-600"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() && (
                            <span className="text-primary">
                              {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  
                  {/* Add Task Row - Inline Form */}
                  {isCreatingNewTask ? (
                    <TableRow className="border-t-2 border-dashed border-gray-300 bg-blue-50">
                      <TableCell colSpan={1}>
                        <Checkbox className="translate-y-[2px]" />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          placeholder="Enter task title..."
                          value={newTaskData.title || ''}
                          onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                          onKeyDown={handleKeyDown}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          autoFocus
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={newTaskData.owner_id || ''}
                          onChange={(e) => setNewTaskData({ ...newTaskData, owner_id: e.target.value || null })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                          <option value="">Unassigned</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="date"
                          value={newTaskData.start_date ? new Date(newTaskData.start_date).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewTaskData({ ...newTaskData, start_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="date"
                          value={newTaskData.end_date ? new Date(newTaskData.end_date).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewTaskData({ ...newTaskData, end_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={newTaskData.status || 'todo'}
                          onChange={(e) => setNewTaskData({ ...newTaskData, status: e.target.value as any })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newTaskData.progress_percentage || 0}
                          onChange={(e) => setNewTaskData({ ...newTaskData, progress_percentage: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button
                            onClick={handleSaveNewTask}
                            disabled={!newTaskData.title?.trim()}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelCreateTask}
                            className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow className="border-t-2 border-dashed border-gray-300">
                      <TableCell colSpan={columns.length} className="p-0">
                        <div 
                          className="p-4 text-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={handleStartCreateTask}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">+</span>
                            <span>Add new task</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats bar */}
        <div className="border-t bg-gray-50 px-6 py-3 text-sm text-gray-600 flex gap-6">
          <div>
            Total: <span className="font-semibold text-gray-900">{tasks.length}</span>
          </div>
          <div>
            In Progress:{' '}
            <span className="font-semibold text-gray-900">
              {tasks.filter((t) => t.status === 'in_progress').length}
            </span>
          </div>
          <div>
            Completed:{' '}
            <span className="font-semibold text-gray-900">
              {tasks.filter((t) => t.status === 'done').length}
            </span>
          </div>
        </div>
      </div>

      {/* Assistant Pane */}
      {/* Latest Position Panel */}
      <LatestPositionPanel
        task={latestPositionTask}
        isOpen={isLatestPositionOpen}
        onClose={() => {
          setIsLatestPositionOpen(false)
          setLatestPositionTask(null)
        }}
      />
    </div>
  )
}

/**
 * Build hierarchical task structure from flat list
 */
function buildTaskHierarchy(tasks: Task[]): TaskWithHierarchy[] {
  const taskMap = new Map<string, TaskWithHierarchy>()
  const rootTasks: TaskWithHierarchy[] = []

  // Initialize all tasks with hierarchy data
  tasks.forEach((task) => {
    taskMap.set(task.id, { ...task, children: [], level: 0 })
  })

  // Build hierarchy
  tasks.forEach((task) => {
    const node = taskMap.get(task.id)!
    if (task.parent_task_id && taskMap.has(task.parent_task_id)) {
      const parent = taskMap.get(task.parent_task_id)!
      node.level = parent.level + 1
      parent.children!.push(node)
    } else {
      rootTasks.push(node)
    }
  })

  return rootTasks
}

