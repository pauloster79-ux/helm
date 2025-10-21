-- Phase 2B: Enhanced Task Management Schema Updates
-- This file contains the database schema updates needed for comprehensive task management
-- Apply this to your Supabase project after the base schema

-- =====================================================
-- ENHANCED TASKS TABLE
-- Add missing fields for comprehensive task management
-- =====================================================

-- Add new columns to existing tasks table
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
-- TASK DEPENDENCIES TABLE
-- For task dependency management
-- =====================================================

CREATE TABLE IF NOT EXISTS task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type TEXT NOT NULL DEFAULT 'finish_to_start' CHECK (dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Prevent self-dependencies
  CONSTRAINT no_self_dependency CHECK (task_id != depends_on_task_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS task_dependencies_task_id_idx ON task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS task_dependencies_depends_on_idx ON task_dependencies(depends_on_task_id);
CREATE INDEX IF NOT EXISTS task_dependencies_created_by_idx ON task_dependencies(created_by);

-- Enable RLS
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for task_dependencies
CREATE POLICY "Users can view task dependencies for their tasks"
  ON task_dependencies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_dependencies.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create task dependencies for their tasks"
  ON task_dependencies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_dependencies.task_id 
      AND tasks.user_id = auth.uid()
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Users can update task dependencies for their tasks"
  ON task_dependencies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_dependencies.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete task dependencies for their tasks"
  ON task_dependencies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_dependencies.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

-- =====================================================
-- ENHANCED FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to prevent circular dependencies
CREATE OR REPLACE FUNCTION check_circular_dependency()
RETURNS TRIGGER AS $$
DECLARE
  cycle_found BOOLEAN := FALSE;
BEGIN
  -- Check for circular dependency using recursive CTE
  WITH RECURSIVE dependency_chain AS (
    -- Base case: start with the new dependency
    SELECT NEW.task_id as current_task, NEW.depends_on_task_id as depends_on, 1 as depth
    UNION ALL
    -- Recursive case: follow the chain
    SELECT td.task_id, td.depends_on_task_id, dc.depth + 1
    FROM task_dependencies td
    JOIN dependency_chain dc ON td.task_id = dc.depends_on
    WHERE dc.depth < 10 -- Prevent infinite recursion
  )
  SELECT EXISTS(
    SELECT 1 FROM dependency_chain 
    WHERE current_task = depends_on
  ) INTO cycle_found;
  
  IF cycle_found THEN
    RAISE EXCEPTION 'Circular dependency detected. Cannot create this dependency.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check circular dependencies
DROP TRIGGER IF EXISTS check_circular_dependency_trigger ON task_dependencies;
CREATE TRIGGER check_circular_dependency_trigger
  BEFORE INSERT OR UPDATE ON task_dependencies
  FOR EACH ROW
  EXECUTE FUNCTION check_circular_dependency();

-- Function to update task completion timestamp
CREATE OR REPLACE FUNCTION update_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Set completed_at when status changes to 'done'
  IF NEW.status = 'done' AND OLD.status != 'done' THEN
    NEW.completed_at = NOW();
    NEW.progress_percentage = 100;
  END IF;
  
  -- Clear completed_at when status changes away from 'done'
  IF NEW.status != 'done' AND OLD.status = 'done' THEN
    NEW.completed_at = NULL;
  END IF;
  
  -- Auto-update progress when status changes
  CASE NEW.status
    WHEN 'todo' THEN NEW.progress_percentage = 0;
    WHEN 'in_progress' THEN 
      IF NEW.progress_percentage = 0 THEN NEW.progress_percentage = 25; END IF;
    WHEN 'review' THEN 
      IF NEW.progress_percentage < 75 THEN NEW.progress_percentage = 75; END IF;
    WHEN 'done' THEN NEW.progress_percentage = 100;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update task completion
DROP TRIGGER IF EXISTS update_task_completion_trigger ON tasks;
CREATE TRIGGER update_task_completion_trigger
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_task_completion();

-- Function to validate latest_position updates
CREATE OR REPLACE FUNCTION validate_latest_position()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure latest_position is an array
  IF jsonb_typeof(NEW.latest_position) != 'array' THEN
    RAISE EXCEPTION 'latest_position must be an array';
  END IF;
  
  -- Validate each position entry
  FOR i IN 0..jsonb_array_length(NEW.latest_position) - 1 LOOP
    DECLARE
      position_entry JSONB;
    BEGIN
      position_entry := NEW.latest_position->i;
      
      -- Check required fields
      IF NOT (position_entry ? 'content' AND position_entry ? 'created_at' AND position_entry ? 'created_by') THEN
        RAISE EXCEPTION 'Each latest_position entry must have content, created_at, and created_by fields';
      END IF;
      
      -- Validate content length
      IF length(position_entry->>'content') = 0 THEN
        RAISE EXCEPTION 'Position content cannot be empty';
      END IF;
      
      IF length(position_entry->>'content') > 5000 THEN
        RAISE EXCEPTION 'Position content cannot exceed 5000 characters';
      END IF;
    END;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate latest_position
DROP TRIGGER IF EXISTS validate_latest_position_trigger ON tasks;
CREATE TRIGGER validate_latest_position_trigger
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION validate_latest_position();

-- Function to add latest position entry
CREATE OR REPLACE FUNCTION add_latest_position(
  task_id_param UUID,
  content_param TEXT,
  created_by_param UUID
)
RETURNS JSONB AS $$
DECLARE
  current_positions JSONB;
  new_position JSONB;
  updated_positions JSONB;
  task_exists BOOLEAN;
BEGIN
  -- Check if task exists and user has access
  SELECT EXISTS(
    SELECT 1 FROM tasks 
    WHERE id = task_id_param 
    AND (user_id = created_by_param OR owner_id = created_by_param)
  ) INTO task_exists;
  
  IF NOT task_exists THEN
    RAISE EXCEPTION 'Task not found or access denied';
  END IF;
  
  -- Get current positions (may be NULL for new tasks)
  SELECT COALESCE(latest_position, '[]'::jsonb) INTO current_positions
  FROM tasks 
  WHERE id = task_id_param 
  AND (user_id = created_by_param OR owner_id = created_by_param);
  
  -- Validate content
  IF length(trim(content_param)) = 0 THEN
    RAISE EXCEPTION 'Content cannot be empty';
  END IF;
  
  IF length(content_param) > 5000 THEN
    RAISE EXCEPTION 'Content cannot exceed 5000 characters';
  END IF;
  
  -- Create new position entry
  new_position := jsonb_build_object(
    'id', uuid_generate_v4(),
    'content', trim(content_param),
    'created_at', NOW(),
    'created_by', created_by_param
  );
  
  -- Add to positions array (append to end)
  updated_positions := current_positions || jsonb_build_array(new_position);
  
  -- Update the task
  UPDATE tasks 
  SET latest_position = updated_positions, updated_at = NOW()
  WHERE id = task_id_param 
  AND (user_id = created_by_param OR owner_id = created_by_param);
  
  RETURN updated_positions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get task hierarchy (for subtasks)
CREATE OR REPLACE FUNCTION get_task_hierarchy(task_id_param UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  status TEXT,
  progress_percentage INTEGER,
  parent_task_id UUID,
  level INTEGER,
  path TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE task_tree AS (
    -- Base case: start with the given task
    SELECT 
      t.id,
      t.title,
      t.status,
      t.progress_percentage,
      t.parent_task_id,
      0 as level,
      t.title as path
    FROM tasks t
    WHERE t.id = task_id_param AND t.user_id = auth.uid()
    
    UNION ALL
    
    -- Recursive case: get children
    SELECT 
      t.id,
      t.title,
      t.status,
      t.progress_percentage,
      t.parent_task_id,
      tt.level + 1,
      tt.path || ' > ' || t.title
    FROM tasks t
    JOIN task_tree tt ON t.parent_task_id = tt.id
    WHERE t.user_id = auth.uid() AND tt.level < 10 -- Prevent infinite recursion
  )
  SELECT * FROM task_tree ORDER BY level, title;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UPDATED RLS POLICIES FOR TASKS
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Create enhanced RLS policies
CREATE POLICY "Users can view own tasks and tasks they own"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = owner_id);

CREATE POLICY "Users can insert tasks in their projects"
  ON tasks FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tasks and tasks they own"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = owner_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- SOFT DELETE FUNCTIONALITY
-- =====================================================

-- Function for soft delete
CREATE OR REPLACE FUNCTION soft_delete_task(task_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  task_exists BOOLEAN;
BEGIN
  -- Check if task exists and user has permission
  SELECT EXISTS(
    SELECT 1 FROM tasks 
    WHERE id = task_id_param 
    AND user_id = auth.uid()
    AND deleted_at IS NULL
  ) INTO task_exists;
  
  IF NOT task_exists THEN
    RAISE EXCEPTION 'Task not found or access denied';
  END IF;
  
  -- Soft delete the task
  UPDATE tasks 
  SET deleted_at = NOW(), updated_at = NOW()
  WHERE id = task_id_param AND user_id = auth.uid();
  
  -- Soft delete all subtasks
  UPDATE tasks 
  SET deleted_at = NOW(), updated_at = NOW()
  WHERE parent_task_id = task_id_param AND user_id = auth.uid();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Create partial indexes for active tasks only
CREATE INDEX IF NOT EXISTS tasks_active_project_id_idx 
  ON tasks(project_id) 
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS tasks_active_status_idx 
  ON tasks(status) 
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS tasks_active_owner_id_idx 
  ON tasks(owner_id) 
  WHERE deleted_at IS NULL AND owner_id IS NOT NULL;

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS tasks_project_status_idx 
  ON tasks(project_id, status) 
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS tasks_user_status_idx 
  ON tasks(user_id, status) 
  WHERE deleted_at IS NULL;

-- =====================================================
-- NOTES
-- =====================================================

-- To apply this schema:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" to execute
-- 4. Verify all tables and functions were created successfully

-- Key features added:
-- - Progress tracking (0-100%)
-- - Parent-child task relationships
-- - Latest position (append-only progress log)
-- - Task dependencies with circular dependency prevention
-- - Soft delete functionality
-- - Enhanced RLS policies
-- - Performance optimizations
-- - Comprehensive validation functions
