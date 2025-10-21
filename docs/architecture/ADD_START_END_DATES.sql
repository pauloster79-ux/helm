-- Add start_date and end_date fields to tasks table
-- This migration adds proper date fields for task planning

-- Add start_date column (nullable)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS start_date DATE;

-- Add end_date column (nullable)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Migrate existing due_date data to end_date (optional, if you want to preserve data)
-- Uncomment if you want to migrate:
-- UPDATE tasks SET end_date = due_date::DATE WHERE due_date IS NOT NULL;

-- Add index for date queries
CREATE INDEX IF NOT EXISTS tasks_start_date_idx ON tasks(start_date);
CREATE INDEX IF NOT EXISTS tasks_end_date_idx ON tasks(end_date);

-- Add check constraint to ensure end_date is after start_date
ALTER TABLE tasks 
ADD CONSTRAINT tasks_dates_check 
CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date);

-- Comment for reference
COMMENT ON COLUMN tasks.start_date IS 'Planned start date for the task';
COMMENT ON COLUMN tasks.end_date IS 'Planned end date for the task (replaces due_date concept)';

