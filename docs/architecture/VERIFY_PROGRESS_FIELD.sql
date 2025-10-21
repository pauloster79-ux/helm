-- Verify Progress Percentage Field Exists
-- Run this query to check if the progress_percentage field is properly set up

-- Check if the column exists in the tasks table
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'tasks' 
    AND column_name = 'progress_percentage';

-- If the above returns a row, the field exists!
-- Expected output:
-- column_name          | data_type | column_default | is_nullable
-- progress_percentage  | integer   | 0              | YES

-- Check current task data
SELECT 
    id,
    title,
    status,
    progress_percentage,
    created_at
FROM tasks
ORDER BY created_at DESC
LIMIT 10;

-- Check progress distribution
SELECT 
    status,
    AVG(progress_percentage) as avg_progress,
    MIN(progress_percentage) as min_progress,
    MAX(progress_percentage) as max_progress,
    COUNT(*) as task_count
FROM tasks
GROUP BY status
ORDER BY status;




