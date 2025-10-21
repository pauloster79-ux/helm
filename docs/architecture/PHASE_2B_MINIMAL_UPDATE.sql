-- Phase 2B: Minimal Task Management Schema Updates
-- ONLY adds missing columns and tables - NO POLICY CHANGES

-- =====================================================
-- 1. ADD MISSING COLUMNS TO TASKS TABLE
-- =====================================================

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS latest_position JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Update status enum to include 'review' status
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('todo', 'in_progress', 'review', 'done'));

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS tasks_progress_percentage_idx ON tasks(progress_percentage);
CREATE INDEX IF NOT EXISTS tasks_parent_task_id_idx ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS tasks_owner_id_idx ON tasks(owner_id);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_completed_at_idx ON tasks(completed_at);
CREATE INDEX IF NOT EXISTS tasks_deleted_at_idx ON tasks(deleted_at);

-- =====================================================
-- 2. CREATE TASK DEPENDENCIES TABLE (Optional - for future use)
-- =====================================================

CREATE TABLE IF NOT EXISTS task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type TEXT NOT NULL DEFAULT 'finish_to_start' CHECK (dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Prevent self-dependencies
  CONSTRAINT no_self_dependency CHECK (task_id != depends_on_task_id),
  -- Prevent duplicate dependencies
  CONSTRAINT unique_task_dependency UNIQUE (task_id, depends_on_task_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS task_dependencies_task_id_idx ON task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS task_dependencies_depends_on_task_id_idx ON task_dependencies(depends_on_task_id);
CREATE INDEX IF NOT EXISTS task_dependencies_created_by_idx ON task_dependencies(created_by);

-- Enable RLS on task_dependencies (inherits existing project policies)
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DONE! 
-- The existing RLS policies on tasks table will handle permissions
-- for the new columns automatically.
-- =====================================================

