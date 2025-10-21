-- Diagnostic Script for Latest Position Issues
-- Run this in Supabase SQL Editor to check your setup

-- =====================================================
-- 1. Check if add_latest_position function exists
-- =====================================================
SELECT 
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'add_latest_position';

-- Expected: Should return 1 row with the function definition
-- If no rows: The function doesn't exist - you need to run FIX_LATEST_POSITION.sql

-- =====================================================
-- 2. Check tasks table structure
-- =====================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'tasks' 
  AND column_name IN ('id', 'user_id', 'owner_id', 'latest_position', 'created_at', 'updated_at')
ORDER BY ordinal_position;

-- Expected: latest_position should be jsonb type, nullable

-- =====================================================
-- 3. Check RLS policies on tasks table
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'tasks';

-- Expected: Should see policies for SELECT, INSERT, UPDATE
-- Make sure there's a policy allowing the user to UPDATE their own tasks

-- =====================================================
-- 4. Test the function manually (REPLACE with your actual task_id and user_id)
-- =====================================================

-- First, let's see a sample task
SELECT 
  id,
  user_id,
  owner_id,
  title,
  latest_position,
  jsonb_typeof(latest_position) as position_type,
  jsonb_array_length(COALESCE(latest_position, '[]'::jsonb)) as position_count
FROM tasks
LIMIT 5;

-- Now test the function (UNCOMMENT and replace the UUIDs with actual values from above)
/*
SELECT add_latest_position(
  'TASK_ID_HERE'::uuid,
  'Test update from diagnostic script',
  'YOUR_USER_ID_HERE'::uuid
);
*/

-- Expected: Should return a JSONB array with your test update
-- If error: Check the error message carefully

-- =====================================================
-- 5. Check if uuid-ossp extension is enabled
-- =====================================================
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

-- Expected: Should return 1 row
-- If no rows: Run: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 6. Verify task exists and user has access
-- =====================================================

-- Check your current user ID (when logged in via Supabase client)
SELECT auth.uid() as current_user_id;

-- Check tasks you have access to
SELECT 
  id,
  title,
  user_id,
  owner_id,
  CASE 
    WHEN user_id = auth.uid() THEN 'You are the creator'
    WHEN owner_id = auth.uid() THEN 'You are the owner'
    ELSE 'No access'
  END as access_level,
  latest_position
FROM tasks
WHERE user_id = auth.uid() OR owner_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- SUMMARY
-- =====================================================
-- After running all queries above, check:
-- ✅ Function exists and has the correct definition
-- ✅ Tasks table has latest_position column (jsonb, nullable)
-- ✅ RLS policies allow UPDATE on tasks
-- ✅ Your tasks are visible in the access check
-- ✅ Manual function test works






