-- Apply Latest Position Fix
-- This script creates the missing add_latest_position function that's causing the error
-- Run this in your Supabase SQL Editor

-- Drop the function if it exists (in case of updates)
DROP FUNCTION IF EXISTS add_latest_position(UUID, TEXT, UUID);

-- Create the add_latest_position function
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

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION add_latest_position(UUID, TEXT, UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION add_latest_position IS 'Adds a new latest position entry to a task. Handles NULL latest_position by initializing as empty array.';

-- Verify the function was created successfully
SELECT 
  p.proname as function_name,
  p.proargtypes::regtype[] as argument_types,
  p.prorettype::regtype as return_type
FROM pg_proc p
WHERE p.proname = 'add_latest_position';
