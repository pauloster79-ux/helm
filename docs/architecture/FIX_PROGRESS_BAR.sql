-- Fix Progress Bar Issue
-- This script adds the missing progress_percentage field to the tasks table
-- Apply this in your Supabase SQL Editor

-- Step 1: Add the progress_percentage column
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0 
CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Step 2: Add index for better query performance
CREATE INDEX IF NOT EXISTS tasks_progress_percentage_idx ON tasks(progress_percentage);

-- Step 3: Set default progress for existing tasks based on status
UPDATE tasks 
SET progress_percentage = CASE 
  WHEN status = 'done' THEN 100
  WHEN status = 'in_progress' THEN 50
  WHEN status = 'review' THEN 75
  ELSE 0
END
WHERE progress_percentage IS NULL;

-- Verify the update
SELECT COUNT(*) as total_tasks, 
       AVG(progress_percentage) as avg_progress,
       MIN(progress_percentage) as min_progress,
       MAX(progress_percentage) as max_progress
FROM tasks;




