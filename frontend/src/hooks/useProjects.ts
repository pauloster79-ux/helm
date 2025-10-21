import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Project, ProjectInsert, ProjectUpdate, ProjectFormData } from '@/types/database.types'

export interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  createProject: (projectData: ProjectFormData) => Promise<Project>
  updateProject: (projectId: string, updates: Partial<ProjectUpdate>) => Promise<Project>
  deleteProject: (projectId: string) => Promise<void>
  getProject: (projectId: string) => Project | undefined
  clearError: () => void
}

export function useProjects(): UseProjectsReturn {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track if we've already fetched for this user
  const lastFetchedUserIdRef = useRef<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchProjects = useCallback(async () => {
    if (!user) {
      console.log('No user, setting projects to empty array')
      setProjects([])
      setLoading(false)
      lastFetchedUserIdRef.current = null
      return
    }

    // Don't refetch if we already fetched for this user
    if (lastFetchedUserIdRef.current === user.id) {
      console.log('Projects already fetched for user:', user.id)
      return
    }

    try {
      console.log('Fetching projects for user:', user.id)
      setLoading(true)
      setError(null)

      // Add timeout to prevent hanging
      const queryPromise = supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Projects fetch timeout')), 5000)
      )
      
      const { data, error: fetchError } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as any

      console.log('Projects fetch result:', { 
        dataCount: data?.length || 0, 
        data: data,
        error: fetchError 
      })

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError)
        throw new Error(`Failed to fetch projects: ${fetchError.message}`)
      }

      console.log('Setting projects:', data?.length || 0, 'projects')
      setProjects(data || [])
      lastFetchedUserIdRef.current = user.id
    } catch (err) {
      console.error('Error fetching projects:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects'
      setError(errorMessage)
      setProjects([])
    } finally {
      console.log('Projects fetch complete, setting loading to false')
      setLoading(false)
    }
  }, [user?.id]) // Use user.id instead of user object to prevent re-renders

  const createProject = useCallback(async (projectData: ProjectFormData): Promise<Project> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Validate required fields
    if (!projectData.name?.trim()) {
      throw new Error('Project name is required')
    }

    if (projectData.name.length > 100) {
      throw new Error('Project name must be 100 characters or less')
    }

    if (projectData.description && projectData.description.length > 500) {
      throw new Error('Project description must be 500 characters or less')
    }

    try {
      setError(null)

      const insertData: ProjectInsert = {
        user_id: user.id,
        name: projectData.name.trim(),
        description: projectData.description?.trim() || null,
        status: projectData.status
      }

      console.log('Creating project with data:', insertData)
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: insertError } = await (supabase as any)
        .from('projects')
        .insert(insertData)
        .select()
        .single()

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        throw new Error(`Failed to create project: ${insertError.message}`)
      }

      if (!data) {
        throw new Error('No data returned from project creation')
      }

      // Add to local state
      setProjects(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project'
      setError(errorMessage)
      throw err
    }
  }, [user])

  const updateProject = useCallback(async (projectId: string, updates: Partial<ProjectUpdate>): Promise<Project> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!projectId) {
      throw new Error('Project ID is required')
    }

    // Validate updates
    if (updates.name !== undefined) {
      if (!updates.name?.trim()) {
        throw new Error('Project name cannot be empty')
      }
      if (updates.name.length > 100) {
        throw new Error('Project name must be 100 characters or less')
      }
    }

    if (updates.description !== undefined && updates.description && updates.description.length > 500) {
      throw new Error('Project description must be 500 characters or less')
    }

    try {
      setError(null)

      const updateData: ProjectUpdate = {
        ...updates,
        name: updates.name?.trim(),
        description: updates.description?.trim() || null
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase as any)
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError) {
        console.error('Supabase update error:', updateError)
        throw new Error(`Failed to update project: ${updateError.message}`)
      }

      if (!data) {
        throw new Error('Project not found or you do not have permission to update it')
      }

      // Update local state
      setProjects(prev => prev.map(p => p.id === projectId ? data : p))
      return data
    } catch (err) {
      console.error('Error updating project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project'
      setError(errorMessage)
      throw err
    }
  }, [user])

  const deleteProject = useCallback(async (projectId: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!projectId) {
      throw new Error('Project ID is required')
    }

    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Supabase delete error:', deleteError)
        throw new Error(`Failed to delete project: ${deleteError.message}`)
      }

      // Remove from local state
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (err) {
      console.error('Error deleting project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project'
      setError(errorMessage)
      throw err
    }
  }, [user])

  const getProject = useCallback((projectId: string): Project | undefined => {
    return projects.find(p => p.id === projectId)
  }, [projects])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    clearError
  }
}