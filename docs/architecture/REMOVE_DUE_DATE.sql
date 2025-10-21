-- Remove due_date column from tasks table
-- This migration removes the due_date field in favor of start_date and end_date
-- which provides better task scheduling capabilities

-- Drop the due_date column
ALTER TABLE tasks 
DROP COLUMN IF EXISTS due_date;

-- The start_date and end_date columns should already exist from ADD_START_END_DATES.sql
-- Verify they exist, if not add them
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'start_date'
    ) THEN
        ALTER TABLE tasks ADD COLUMN start_date DATE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'end_date'
    ) THEN
        ALTER TABLE tasks ADD COLUMN end_date DATE;
    END IF;
END $$;

-- Ensure indexes exist for start_date and end_date
CREATE INDEX IF NOT EXISTS tasks_start_date_idx ON tasks(start_date);
CREATE INDEX IF NOT EXISTS tasks_end_date_idx ON tasks(end_date);

-- Ensure check constraint exists to validate date order
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tasks_dates_check'
    ) THEN
        ALTER TABLE tasks 
        ADD CONSTRAINT tasks_dates_check 
        CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date);
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN tasks.start_date IS 'Planned start date for the task';
COMMENT ON COLUMN tasks.end_date IS 'Planned end date for the task';

