import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Project, ProjectUpdate } from '@/types/database.types'

export interface UseProjectReturn {
  project: Project | null
  loading: boolean
  error: string | null
  updateProject: (updates: Partial<ProjectUpdate>) => Promise<Project>
  deleteProject: () => Promise<void>
  refreshProject: () => Promise<void>
  clearError: () => void
}

/**
 * Optimized hook for fetching a single project
 * This avoids loading all projects when you only need one
 */
export function useProject(projectId: string | undefined): UseProjectReturn {
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchProject = useCallback(async () => {
    if (!user) {
      setProject(null)
      setLoading(false)
      return
    }

    if (!projectId) {
      setProject(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError)
        throw new Error(`Failed to fetch project: ${fetchError.message}`)
      }

      setProject(data)
    } catch (err) {
      console.error('Error fetching project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load project'
      setError(errorMessage)
      setProject(null)
    } finally {
      setLoading(false)
    }
  }, [user, projectId])

  const updateProject = useCallback(async (updates: Partial<ProjectUpdate>): Promise<Project> => {
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

      const updateData = {
        ...updates,
        name: updates.name?.trim(),
        description: updates.description?.trim() || null
      }

      // Type assertion necessary due to Supabase type system limitations with update queries
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
      setProject(data)
      return data
    } catch (err) {
      console.error('Error updating project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project'
      setError(errorMessage)
      throw err
    }
  }, [user, projectId])

  const deleteProject = useCallback(async (): Promise<void> => {
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

      // Clear local state
      setProject(null)
    } catch (err) {
      console.error('Error deleting project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project'
      setError(errorMessage)
      throw err
    }
  }, [user, projectId])

  const refreshProject = useCallback(async () => {
    await fetchProject()
  }, [fetchProject])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  return {
    project,
    loading,
    error,
    updateProject,
    deleteProject,
    refreshProject,
    clearError
  }
}

