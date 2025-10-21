-- =====================================================
-- QUICK FIX: Add Missing Task Columns
-- =====================================================
-- Copy this entire script and run it in Supabase SQL Editor
-- This will fix the task editing errors

-- Add missing columns to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0 
  CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE;

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

DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = owner_id);

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- Done! Refresh your app and try editing tasks again.


