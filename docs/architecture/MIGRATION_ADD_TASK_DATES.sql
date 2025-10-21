-- Migration: Add start_date and end_date columns to tasks table
-- Date: 2024
-- Description: Adds date tracking fields to tasks table

-- Add start_date column
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;

-- Add end_date column
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- Add progress_percentage column (if not exists)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Add owner_id column (if not exists) for task assignment
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Add parent_task_id column (if not exists) for subtasks
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE;

-- Add deleted_at column for soft deletes
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Update status constraint to include 'review' status
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('todo', 'in_progress', 'review', 'done'));

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS tasks_start_date_idx ON tasks(start_date);
CREATE INDEX IF NOT EXISTS tasks_end_date_idx ON tasks(end_date);
CREATE INDEX IF NOT EXISTS tasks_progress_percentage_idx ON tasks(progress_percentage);
CREATE INDEX IF NOT EXISTS tasks_owner_id_idx ON tasks(owner_id);
CREATE INDEX IF NOT EXISTS tasks_parent_task_id_idx ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS tasks_deleted_at_idx ON tasks(deleted_at);

-- Update RLS policies to include owner_id
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = owner_id);

-- Add comment for documentation
COMMENT ON COLUMN tasks.start_date IS 'Planned or actual start date of the task';
COMMENT ON COLUMN tasks.end_date IS 'Planned or actual end date of the task';
COMMENT ON COLUMN tasks.progress_percentage IS 'Task completion percentage (0-100)';
COMMENT ON COLUMN tasks.owner_id IS 'User assigned to this task (can be different from creator)';
COMMENT ON COLUMN tasks.parent_task_id IS 'Parent task for subtasks (null for top-level tasks)';
COMMENT ON COLUMN tasks.deleted_at IS 'Soft delete timestamp (null if not deleted)';


