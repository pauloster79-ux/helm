export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Additional type definitions for components
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Extended types for components
export interface TaskWithDetails extends Task {
  project?: Project
  owner?: Profile
  parent_task?: Task
  children?: Task[]
}

export interface TaskWithHierarchy extends Task {
  project?: Project
  owner?: Profile
  parent_task?: Task
  children?: TaskWithHierarchy[]
  level: number
}

export interface TaskHierarchy {
  task: Task
  children: TaskHierarchy[]
  level: number
}

export interface TaskFormData {
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  estimated_hours: number | null
  start_date: string | null
  end_date: string | null
  owner_id: string | null
  parent_task_id: string | null
}

export interface TaskFormErrors {
  title?: string
  description?: string
  status?: string
  priority?: string
  estimated_hours?: string
  start_date?: string
  end_date?: string
  owner_id?: string
  parent_task_id?: string
}

export interface ProjectFormData {
  name: string
  description: string
  status: 'planning' | 'active' | 'completed' | 'archived'
}

export interface ProjectFormErrors {
  name?: string
  description?: string
  status?: string
}

export interface TaskListOptions {
  status?: string[]
  priority?: string[]
  owner_id?: string
  project_id?: string
  search?: string
}

export interface TaskFilters {
  status: string[]
  priority: string[]
  owner_id: string | null
  project_id: string | null
  search: string
}

export interface TaskSortOptions {
  field: 'title' | 'status' | 'priority' | 'created_at' | 'updated_at'
  direction: 'asc' | 'desc'
}

export interface LatestPositionEntry {
  id: string
  task_id: string
  user_id: string
  position: string
  created_at: string
  updated_at: string
}

export interface LatestPositionFormData {
  position: string
}

export interface LatestPositionFormErrors {
  position?: string
}

export interface TaskDependency {
  id: string
  task_id: string
  depends_on_task_id: string
  dependency_type: 'blocks' | 'relates_to'
  created_at: string
  updated_at: string
}

export interface TaskDependencyInsert {
  task_id: string
  depends_on_task_id: string
  dependency_type: 'blocks' | 'relates_to'
}

// AI-related types (placeholder for future implementation)
export interface AIProposal {
  id: string
  task_id: string
  proposal_type: string
  content: string
  confidence: number
  created_at: string
}

export interface ValidationIssue {
  id: string
  field: string
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface ProposalWithDetails {
  id: string
  task_id: string
  proposal_type: string
  content: string
  confidence: number
  evidence: any[]
  created_at: string
}

export interface AIValidationRequest {
  task_id: string
  validation_type: string
  data: any
}

export interface AIValidationResponse {
  is_valid: boolean
  issues: ValidationIssue[]
  suggestions: string[]
}

export interface ProposalFilters {
  task_id?: string
  proposal_type?: string
  status?: string
}

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          project_id: string
          uploaded_by: string
          title: string
          description: string | null
          file_path: string
          file_name: string
          file_type: string
          file_size: number
          document_type: 'requirements' | 'design' | 'meeting_notes' | 'reports' | 'reference' | 'other'
          status: 'draft' | 'review' | 'final' | 'archived'
          author: string | null
          version_number: number
          last_accessed_at: string | null
          download_count: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          uploaded_by: string
          title: string
          description?: string | null
          file_path: string
          file_name: string
          file_type: string
          file_size: number
          document_type?: 'requirements' | 'design' | 'meeting_notes' | 'reports' | 'reference' | 'other'
          status?: 'draft' | 'review' | 'final' | 'archived'
          author?: string | null
          version_number?: number
          last_accessed_at?: string | null
          download_count?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          uploaded_by?: string
          title?: string
          description?: string | null
          file_path?: string
          file_name?: string
          file_type?: string
          file_size?: number
          document_type?: 'requirements' | 'design' | 'meeting_notes' | 'reports' | 'reference' | 'other'
          status?: 'draft' | 'review' | 'final' | 'archived'
          author?: string | null
          version_number?: number
          last_accessed_at?: string | null
          download_count?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'planning' | 'active' | 'completed' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'planning' | 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: 'planning' | 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'review' | 'done'
          priority: 'low' | 'medium' | 'high'
          estimated_hours: number | null
          progress_percentage: number
          start_date: string | null
          end_date: string | null
          owner_id: string | null
          parent_task_id: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high'
          estimated_hours?: number | null
          progress_percentage?: number
          start_date?: string | null
          end_date?: string | null
          owner_id?: string | null
          parent_task_id?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high'
          estimated_hours?: number | null
          progress_percentage?: number
          start_date?: string | null
          end_date?: string | null
          owner_id?: string | null
          parent_task_id?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_document_download_count: {
        Args: {
          document_id: string
        }
        Returns: undefined
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
