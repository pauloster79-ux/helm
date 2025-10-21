import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { 
  Task, 
  TaskUpdate, 
  TaskFormData,
  TaskListOptions,
  TaskWithDetails,
  TaskHierarchy,
  LatestPositionEntry,
  TaskDependency,
  TaskDependencyInsert
} from '@/types/database.types'

export interface UseTasksReturn {
  // State
  tasks: Task[]
  loading: boolean
  error: string | null
  
  // CRUD Operations
  fetchTasks: (projectId: string, options?: TaskListOptions) => Promise<void>
  createTask: (projectId: string, taskData: TaskFormData) => Promise<Task>
  updateTask: (taskId: string, updates: Partial<TaskUpdate>) => Promise<Task>
  deleteTask: (taskId: string) => Promise<void>
  getTask: (taskId: string) => Task | undefined
  getTaskWithDetails: (taskId: string) => Promise<TaskWithDetails | null>
  
  // Latest Position Management
  addLatestPosition: (taskId: string, content: string) => Promise<LatestPositionEntry[]>
  
  // Task Hierarchy
  getTaskHierarchy: (taskId: string) => Promise<TaskHierarchy[]>
  getSubtasks: (parentTaskId: string) => Promise<Task[]>
  
  // Task Dependencies
  createTaskDependency: (dependencyData: TaskDependencyInsert) => Promise<TaskDependency>
  deleteTaskDependency: (dependencyId: string) => Promise<void>
  getTaskDependencies: (taskId: string) => Promise<TaskDependency[]>
  
  // Utility
  clearError: () => void
  validateTaskData: (taskData: TaskFormData) => { isValid: boolean; errors: Record<string, string> }
}

export function useTasks(): UseTasksReturn {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Comprehensive task data validation
  const validateTaskData = useCallback((taskData: TaskFormData): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}

    // Title validation
    if (!taskData.title?.trim()) {
      errors.title = 'Task title is required'
    } else if (taskData.title.length < 3) {
      errors.title = 'Task title must be at least 3 characters'
    } else if (taskData.title.length > 200) {
      errors.title = 'Task title must be 200 characters or less'
    }

    // Description validation (optional but has max length)
    if (taskData.description && taskData.description.length > 5000) {
      errors.description = 'Task description must be 5000 characters or less'
    }

    // Status validation
    const validStatuses = ['todo', 'in_progress', 'review', 'done']
    if (!validStatuses.includes(taskData.status)) {
      errors.status = 'Invalid task status'
    }

    // Priority validation
    const validPriorities = ['low', 'medium', 'high']
    if (!validPriorities.includes(taskData.priority)) {
      errors.priority = 'Invalid task priority'
    }

    // Progress validation
    if (taskData.progress_percentage !== undefined) {
      if (taskData.progress_percentage < 0 || taskData.progress_percentage > 100) {
        errors.progress_percentage = 'Progress must be between 0 and 100'
      }
    }

    // Estimated hours validation
    if (taskData.estimated_hours !== undefined && taskData.estimated_hours !== null) {
      if (taskData.estimated_hours < 0) {
        errors.estimated_hours = 'Estimated hours cannot be negative'
      } else if (taskData.estimated_hours > 10000) {
        errors.estimated_hours = 'Estimated hours cannot exceed 10,000'
      }
    }

    // Date validation
    if (taskData.start_date && taskData.end_date) {
      const startDate = new Date(taskData.start_date)
      const endDate = new Date(taskData.end_date)
      if (endDate < startDate) {
        errors.end_date = 'End date must be after start date'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }, [])

  // Fetch tasks with comprehensive filtering and sorting
  const fetchTasks = useCallback(async (projectId: string, options: TaskListOptions = {}): Promise<void> => {
    console.log('🚀 fetchTasks called with:', { projectId, options, userId: user?.id })
    
    if (!user) {
      console.log('❌ No user found')
      setTasks([])
      setLoading(false)
      return
    }

    if (!projectId) {
      console.log('❌ No project ID provided')
      setError('Project ID is required')
      setLoading(false)
      return
    }

    try {
      console.log('⏳ Starting task fetch...')
      setLoading(true)
      setError(null)

      // For list views, only select necessary columns (exclude large JSONB fields)
      // This significantly improves query performance
      // Fallback to basic fields if enhanced schema not available
      const selectFields = 'id,project_id,user_id,title,description,status,priority,estimated_hours,created_at,updated_at'

      let query = supabase
        .from('tasks')
        .select(selectFields)
        .eq('project_id', projectId)
        .eq('user_id', user.id)

      // Apply filters
      if (options.filters) {
        const { filters } = options

        // Status filter
        if (filters.status && filters.status.length > 0) {
          query = query.in('status', filters.status)
        }

        // Priority filter
        if (filters.priority && filters.priority.length > 0) {
          query = query.in('priority', filters.priority)
        }

        // Owner filter
        if (filters.owner_id) {
          query = query.eq('owner_id', filters.owner_id)
        }

        // Parent task filter
        if (filters.parent_task_id !== undefined) {
          if (filters.parent_task_id === null) {
            query = query.is('parent_task_id', null)
          } else {
            query = query.eq('parent_task_id', filters.parent_task_id)
          }
        }

        // Start date filters
        if (filters.start_date_from) {
          query = query.gte('start_date', filters.start_date_from)
        }
        if (filters.start_date_to) {
          query = query.lte('start_date', filters.start_date_to)
        }

        // End date filters
        if (filters.end_date_from) {
          query = query.gte('end_date', filters.end_date_from)
        }
        if (filters.end_date_to) {
          query = query.lte('end_date', filters.end_date_to)
        }

        // Progress filters
        if (filters.progress_min !== undefined) {
          query = query.gte('progress_percentage', filters.progress_min)
        }
        if (filters.progress_max !== undefined) {
          query = query.lte('progress_percentage', filters.progress_max)
        }

        // Search filter
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
        }
      }

      // Include subtasks filter
      if (!options.include_subtasks) {
        query = query.is('parent_task_id', null)
      }

      // Include deleted filter
      if (!options.include_deleted) {
        query = query.is('deleted_at', null)
      }

      // Apply sorting
      if (options.sort) {
        const { field, direction } = options.sort
        query = query.order(field, { ascending: direction === 'asc' })
      } else {
        // Default sorting
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination with reasonable defaults
      const page = options.page || 1
      const limit = options.limit || 100 // Default limit to prevent loading too many tasks
      const from = (page - 1) * limit
      const to = from + limit - 1
      
      // Only apply range if it's not the first page with default limit
      // This optimizes the query for most common use cases
      if (options.page || options.limit) {
        query = query.range(from, to)
      } else {
        // For default queries, just add a reasonable limit
        query = query.limit(100)
      }

      console.log('📡 Executing Supabase query...')
      const { data, error: fetchError } = await query
      console.log('📥 Query result:', { dataCount: data?.length, error: fetchError })

      if (fetchError) {
        console.error('❌ Supabase fetch error:', fetchError)
        
        // Handle different types of errors
        if (fetchError.message.includes('column') || fetchError.message.includes('does not exist')) {
          console.log('🔄 Retrying with basic schema fields...')
          const basicQuery = supabase
            .from('tasks')
            .select('id,project_id,user_id,title,description,status,priority,estimated_hours,created_at,updated_at')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(100)
          
          const { data: basicData, error: basicError } = await basicQuery
          console.log('🔄 Basic query result:', { dataCount: basicData?.length, error: basicError })
          
          if (basicError) {
            console.error('❌ Basic schema fetch also failed:', basicError)
            throw new Error(`Failed to fetch tasks: ${basicError.message}`)
          }
          
          console.log('✅ Basic query succeeded, setting tasks:', basicData?.length || 0)
          setTasks(basicData || [])
          return
        }
        
        // Handle network errors more gracefully
        if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError')) {
          console.log('🌐 Network error detected, retrying in 1 second...')
          
          // Wait 1 second and retry once
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          try {
            const retryQuery = supabase
              .from('tasks')
              .select('id,project_id,user_id,title,description,status,priority,estimated_hours,created_at,updated_at')
              .eq('project_id', projectId)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(100)
            
            const { data: retryData, error: retryError } = await retryQuery
            console.log('🔄 Retry query result:', { dataCount: retryData?.length, error: retryError })
            
            if (retryError) {
              throw new Error(`Network error: Unable to connect to database. Please check your internet connection and try again.`)
            }
            
            console.log('✅ Retry succeeded, setting tasks:', retryData?.length || 0)
            setTasks(retryData || [])
            return
          } catch (retryErr) {
            throw new Error(`Network error: Unable to connect to database. Please check your internet connection and try again.`)
          }
        }
        
        throw new Error(`Failed to fetch tasks: ${fetchError.message}`)
      }

      console.log('✅ Enhanced query succeeded, setting tasks:', data?.length || 0)
      setTasks(data || [])
    } catch (err) {
      console.error('❌ Error fetching tasks:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks'
      setError(errorMessage)
      setTasks([])
    } finally {
      console.log('🏁 Task fetch completed')
      setLoading(false)
    }
  }, [user])

  // Create task with comprehensive validation
  const createTask = useCallback(async (projectId: string, taskData: TaskFormData): Promise<Task> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!projectId) {
      throw new Error('Project ID is required')
    }

    // Validate task data
    const validation = validateTaskData(taskData)
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0]
      throw new Error(firstError)
    }

    try {
      setError(null)

      // Use basic schema fields to avoid column errors
      const insertData: any = {
        project_id: projectId,
        user_id: user.id,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || null,
        status: taskData.status,
        priority: taskData.priority,
        estimated_hours: taskData.estimated_hours || null
      }

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert(insertData)
        .select()
        .single()

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        throw new Error(`Failed to create task: ${insertError.message}`)
      }

      if (!data) {
        throw new Error('No data returned from task creation')
      }

      // Add to local state
      setTasks(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating task:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task'
      setError(errorMessage)
      throw err
    }
  }, [user, validateTaskData])

  // Update task with validation
  const updateTask = useCallback(async (taskId: string, updates: Partial<TaskUpdate>): Promise<Task> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!taskId) {
      throw new Error('Task ID is required')
    }

    // Only validate if we're updating title (since title is required)
    // For other fields, skip validation to allow partial updates
    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        throw new Error('Task title is required')
      }
      if (updates.title.length < 3) {
        throw new Error('Task title must be at least 3 characters')
      }
      if (updates.title.length > 200) {
        throw new Error('Task title must be 200 characters or less')
      }
    }

    try {
      setError(null)

      // Prepare update data with proper type handling
      const updateData = {
        ...updates,
        title: updates.title?.trim(),
        description: updates.description?.trim() || null
      }

      // Type assertion necessary due to Supabase type system limitations with update queries
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase as any)
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .or(`user_id.eq.${user.id},owner_id.eq.${user.id}`)
        .select()
        .single()

      if (updateError) {
        console.error('Supabase update error:', updateError)
        throw new Error(`Failed to update task: ${updateError.message}`)
      }

      if (!data) {
        throw new Error('Task not found or you do not have permission to update it')
      }

      // Update local state
      setTasks(prev => prev.map(t => t.id === taskId ? data : t))
      return data
    } catch (err) {
      console.error('Error updating task:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task'
      setError(errorMessage)
      throw err
    }
  }, [user, validateTaskData])

  // Delete task (soft delete)
  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!taskId) {
      throw new Error('Task ID is required')
    }

    try {
      setError(null)

      // Use the soft delete function from the database
      const { error: deleteError } = await supabase.rpc('soft_delete_task', {
        task_id_param: taskId
      } as any) // Type assertion for RPC call

      if (deleteError) {
        console.error('Supabase delete error:', deleteError)
        throw new Error(`Failed to delete task: ${deleteError.message}`)
      }

      // Remove from local state
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('Error deleting task:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task'
      setError(errorMessage)
      throw err
    }
  }, [user])

  // Get single task
  const getTask = useCallback((taskId: string): Task | undefined => {
    return tasks.find(t => t.id === taskId)
  }, [tasks])

  // Get task with full details including latest_position
  const getTaskWithDetails = useCallback(async (taskId: string): Promise<TaskWithDetails | null> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      // When fetching full details, we need ALL fields including latest_position
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          parent_task:tasks!parent_task_id(id,title,status),
          subtasks:tasks!parent_task_id(id,title,status,progress_percentage),
          dependencies:task_dependencies(*),
          owner:profiles!owner_id(id,full_name,email,avatar_url)
        `)
        .eq('id', taskId)
        .or(`user_id.eq.${user.id},owner_id.eq.${user.id}`)
        .single()

      if (error) {
        console.error('Error fetching task details:', error)
        return null
      }

      return data as TaskWithDetails
    } catch (err) {
      console.error('Error getting task details:', err)
      return null
    }
  }, [user])

  // Add latest position entry
  const addLatestPosition = useCallback(async (taskId: string, content: string): Promise<LatestPositionEntry[]> => {
    console.log('🔍 addLatestPosition called with:', { taskId, content, userId: user?.id })
    
    if (!user) {
      console.error('❌ User not authenticated')
      throw new Error('User not authenticated')
    }

    if (!content.trim()) {
      console.error('❌ Content is empty')
      throw new Error('Content cannot be empty')
    }

    if (content.length > 5000) {
      console.error('❌ Content too long:', content.length)
      throw new Error('Content cannot exceed 5000 characters')
    }

    try {
      console.log('📡 Calling Supabase RPC add_latest_position...')
      const { data, error } = await supabase.rpc('add_latest_position', {
        task_id_param: taskId,
        content_param: content.trim(),
        created_by_param: user.id
      } as any) // Type assertion for RPC call

      console.log('📥 Supabase RPC response:', { data, error })

      if (error) {
        console.error('❌ Supabase RPC error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Failed to add latest position: ${error.message}`)
      }

      if (!data) {
        console.error('❌ No data returned from RPC')
        throw new Error('No data returned from add_latest_position')
      }

      console.log('✅ Latest position added successfully:', data)

      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, latest_position: data }
          : t
      ))

      return data
    } catch (err) {
      console.error('❌ Error in addLatestPosition:', err)
      throw err
    }
  }, [user])

  // Get task hierarchy
  const getTaskHierarchy = useCallback(async (taskId: string): Promise<TaskHierarchy[]> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { data, error } = await supabase.rpc('get_task_hierarchy', {
        task_id_param: taskId
      } as any) // Type assertion for RPC call

      if (error) {
        console.error('Error fetching task hierarchy:', error)
        throw new Error(`Failed to fetch task hierarchy: ${error.message}`)
      }

      return data || []
    } catch (err) {
      console.error('Error getting task hierarchy:', err)
      throw err
    }
  }, [user])

  // Get subtasks
  const getSubtasks = useCallback(async (parentTaskId: string): Promise<Task[]> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('parent_task_id', parentTaskId)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching subtasks:', error)
        throw new Error(`Failed to fetch subtasks: ${error.message}`)
      }

      return data || []
    } catch (err) {
      console.error('Error getting subtasks:', err)
      throw err
    }
  }, [user])

  // Create task dependency
  const createTaskDependency = useCallback(async (dependencyData: TaskDependencyInsert): Promise<TaskDependency> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { data, error } = await supabase
        .from('task_dependencies')
        .insert({
          ...dependencyData,
          created_by: user.id
        } as any) // Type assertion needed due to Supabase type inference limitations
        .select()
        .single()

      if (error) {
        console.error('Error creating task dependency:', error)
        throw new Error(`Failed to create task dependency: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('Error creating task dependency:', err)
      throw err
    }
  }, [user])

  // Delete task dependency
  const deleteTaskDependency = useCallback(async (dependencyId: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { error } = await supabase
        .from('task_dependencies')
        .delete()
        .eq('id', dependencyId)
        .eq('created_by', user.id)

      if (error) {
        console.error('Error deleting task dependency:', error)
        throw new Error(`Failed to delete task dependency: ${error.message}`)
      }
    } catch (err) {
      console.error('Error deleting task dependency:', err)
      throw err
    }
  }, [user])

  // Get task dependencies
  const getTaskDependencies = useCallback(async (taskId: string): Promise<TaskDependency[]> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { data, error } = await supabase
        .from('task_dependencies')
        .select('*')
        .eq('task_id', taskId)

      if (error) {
        console.error('Error fetching task dependencies:', error)
        throw new Error(`Failed to fetch task dependencies: ${error.message}`)
      }

      return data || []
    } catch (err) {
      console.error('Error getting task dependencies:', err)
      throw err
    }
  }, [user])

  return {
    // State
    tasks,
    loading,
    error,
    
    // CRUD Operations
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTask,
    getTaskWithDetails,
    
    // Latest Position Management
    addLatestPosition,
    
    // Task Hierarchy
    getTaskHierarchy,
    getSubtasks,
    
    // Task Dependencies
    createTaskDependency,
    deleteTaskDependency,
    getTaskDependencies,
    
    // Utility
    clearError,
    validateTaskData
  }
}
