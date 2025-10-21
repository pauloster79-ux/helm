-- Add the missing start_date and end_date columns
-- Copy this and run in Supabase SQL Editor

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS tasks_start_date_idx ON tasks(start_date);
CREATE INDEX IF NOT EXISTS tasks_end_date_idx ON tasks(end_date);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
  AND column_name IN ('start_date', 'end_date')
ORDER BY ordinal_position;
