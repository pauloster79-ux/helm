-- Phase 2B: Simple Task Management Schema Updates (No Policy Changes)
-- This adds only the missing columns and tables without modifying existing RLS policies

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
-- 2. CREATE TASK DEPENDENCIES TABLE
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

-- =====================================================
-- 3. ADD RLS POLICIES FOR TASK DEPENDENCIES (if not exists)
-- =====================================================

-- Enable RLS
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view task dependencies in their projects" ON task_dependencies;
DROP POLICY IF EXISTS "Users can create task dependencies in their projects" ON task_dependencies;
DROP POLICY IF EXISTS "Users can update task dependencies in their projects" ON task_dependencies;
DROP POLICY IF EXISTS "Users can delete task dependencies in their projects" ON task_dependencies;

-- Users can view task dependencies in their projects
CREATE POLICY "Users can view task dependencies in their projects"
  ON task_dependencies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      WHERE t.id = task_dependencies.task_id
      AND p.owner_id = auth.uid()
    )
  );

-- Users can create task dependencies in their projects
CREATE POLICY "Users can create task dependencies in their projects"
  ON task_dependencies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      WHERE t.id = task_dependencies.task_id
      AND p.owner_id = auth.uid()
    )
  );

-- Users can update task dependencies in their projects
CREATE POLICY "Users can update task dependencies in their projects"
  ON task_dependencies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      WHERE t.id = task_dependencies.task_id
      AND p.owner_id = auth.uid()
    )
  );

-- Users can delete task dependencies in their projects
CREATE POLICY "Users can delete task dependencies in their projects"
  ON task_dependencies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      WHERE t.id = task_dependencies.task_id
      AND p.owner_id = auth.uid()
    )
  );

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND column_name IN ('progress_percentage', 'parent_task_id', 'owner_id', 'latest_position', 'due_date', 'completed_at', 'deleted_at')
ORDER BY column_name;

-- Verify the task_dependencies table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'task_dependencies'
) AS task_dependencies_exists;

