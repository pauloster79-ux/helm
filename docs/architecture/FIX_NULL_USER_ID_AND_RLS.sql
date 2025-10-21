-- =====================================================
-- URGENT FIX: NULL user_id and RLS Issues
-- =====================================================
-- This fixes projects that have NULL user_id values
-- and re-enables RLS policies that may have been disabled
-- =====================================================

-- =====================================================
-- STEP 1: DIAGNOSE THE ISSUE
-- =====================================================

-- Check if RLS is currently enabled
SELECT 
  tablename, 
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✓ RLS Enabled' 
    ELSE '⚠️ RLS DISABLED - This is the problem!'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'projects';

-- Check for projects with NULL user_id
SELECT 
  COUNT(*) as projects_with_null_user_id,
  CASE 
    WHEN COUNT(*) > 0 THEN '⚠️ Found projects with NULL user_id - These are invisible!'
    ELSE '✓ No NULL user_ids found'
  END as status
FROM projects 
WHERE user_id IS NULL;

-- List all projects with their user_id status
SELECT 
  id,
  name,
  user_id,
  CASE 
    WHEN user_id IS NULL THEN '⚠️ NULL - INVISIBLE'
    WHEN user_id IN (SELECT id FROM profiles) THEN '✓ Valid User'
    ELSE '⚠️ Invalid User ID'
  END as user_status,
  status,
  created_at
FROM projects
ORDER BY created_at DESC;

-- =====================================================
-- STEP 2: FIX NULL user_id VALUES
-- =====================================================

-- First, let's see who the current users are
SELECT 
  id as user_id,
  email,
  created_at
FROM profiles
ORDER BY created_at ASC;

-- OPTION A: Assign all NULL user_id projects to the first user
-- (Good if you're the only user or want to claim all orphaned projects)
-- UNCOMMENT to execute:

-- UPDATE projects 
-- SET user_id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
-- WHERE user_id IS NULL;

-- OPTION B: Assign NULL user_id projects to a specific user
-- Replace 'YOUR_USER_EMAIL@example.com' with your actual email
-- UNCOMMENT and edit to execute:

-- UPDATE projects 
-- SET user_id = (SELECT id FROM profiles WHERE email = 'YOUR_USER_EMAIL@example.com')
-- WHERE user_id IS NULL;

-- OPTION C: Delete projects with NULL user_id
-- (Use this if they're test data you don't need)
-- UNCOMMENT to execute:

-- DELETE FROM projects WHERE user_id IS NULL;

-- =====================================================
-- STEP 3: RE-ENABLE RLS
-- =====================================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Also make sure RLS is enabled on related tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: RECREATE ALL RLS POLICIES
-- =====================================================

-- PROJECTS TABLE POLICIES
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- PROFILES TABLE POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- TASKS TABLE POLICIES
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- STEP 5: CREATE HELPER FUNCTION TO PREVENT NULL user_id
-- =====================================================

-- This function ensures that projects always have a valid user_id
CREATE OR REPLACE FUNCTION check_user_id_not_null()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be NULL. Please provide a valid user_id.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to prevent NULL user_id on INSERT
DROP TRIGGER IF EXISTS ensure_user_id_not_null_on_insert ON projects;
CREATE TRIGGER ensure_user_id_not_null_on_insert
  BEFORE INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION check_user_id_not_null();

-- Add trigger to prevent NULL user_id on UPDATE
DROP TRIGGER IF EXISTS ensure_user_id_not_null_on_update ON projects;
CREATE TRIGGER ensure_user_id_not_null_on_update
  BEFORE UPDATE ON projects
  FOR EACH ROW
  WHEN (NEW.user_id IS NULL)
  EXECUTE FUNCTION check_user_id_not_null();

-- =====================================================
-- STEP 6: FINAL VERIFICATION
-- =====================================================

-- Verify RLS is enabled on all tables
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✓ Enabled' 
    ELSE '✗ Disabled' 
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('projects', 'profiles', 'tasks')
ORDER BY tablename;
-- All should show '✓ Enabled'

-- Verify all policies exist
SELECT 
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN tablename = 'projects' AND COUNT(*) = 4 THEN '✓ All policies present'
    WHEN tablename = 'profiles' AND COUNT(*) = 3 THEN '✓ All policies present'
    WHEN tablename = 'tasks' AND COUNT(*) = 4 THEN '✓ All policies present'
    ELSE '⚠️ Missing policies'
  END as status
FROM pg_policies
WHERE tablename IN ('projects', 'profiles', 'tasks')
GROUP BY tablename
ORDER BY tablename;

-- Check for any remaining NULL user_id values
SELECT 
  'Projects with NULL user_id' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ All projects have valid user_id'
    ELSE '⚠️ Still have NULL user_ids - run OPTION A or B above'
  END as status
FROM projects 
WHERE user_id IS NULL;

-- Summary of all projects
SELECT 
  COUNT(*) as total_projects,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as projects_with_user_id,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as projects_without_user_id,
  COUNT(DISTINCT user_id) as unique_users
FROM projects;

-- Show which users have how many projects
SELECT 
  p.email,
  COUNT(pr.id) as project_count
FROM profiles p
LEFT JOIN projects pr ON p.id = pr.user_id
GROUP BY p.id, p.email
ORDER BY project_count DESC;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- After running this script:
-- 1. All projects should have a valid user_id
-- 2. RLS should be enabled on all tables
-- 3. All policies should be in place
-- 4. Go to /diagnostic in your app to verify
-- 5. Go to /projects to see your projects
-- =====================================================

