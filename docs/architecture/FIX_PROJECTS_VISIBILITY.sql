-- =====================================================
-- QUICK FIX: Projects Not Visible Issue
-- =====================================================
-- Run this script in Supabase SQL Editor to fix common issues
-- that prevent projects from showing up in the app.

-- =====================================================
-- 1. ENSURE PROFILES TABLE HAS ALL USERS
-- =====================================================

-- Create profile for any auth user that doesn't have one
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Verify profiles were created
SELECT COUNT(*) as missing_profiles
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
-- Should return 0

-- =====================================================
-- 2. RECREATE PROFILE TRIGGER (for future users)
-- =====================================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 3. ENABLE RLS AND RECREATE POLICIES
-- =====================================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Recreate all RLS policies
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

-- =====================================================
-- 4. VERIFY EVERYTHING IS SET UP CORRECTLY
-- =====================================================

-- Check RLS is enabled
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'projects';
-- Should show rls_enabled = true

-- Check policies exist
SELECT 
  policyname,
  cmd as operation,
  permissive
FROM pg_policies
WHERE tablename = 'projects'
ORDER BY policyname;
-- Should show 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- Check if all users have profiles
SELECT 
  u.id as user_id,
  u.email,
  CASE WHEN p.id IS NOT NULL THEN '✓ Has Profile' ELSE '✗ Missing Profile' END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Check projects and their owners
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.user_id,
  pr.email as owner_email,
  CASE WHEN pr.id IS NOT NULL THEN '✓ Valid Owner' ELSE '✗ Invalid Owner' END as owner_status,
  p.status,
  p.created_at
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC;

-- =====================================================
-- 5. OPTIONAL: FIX ORPHANED PROJECTS
-- =====================================================
-- Run this ONLY if you see projects with invalid owners above

-- Option A: Delete projects with no valid owner
-- UNCOMMENT ONLY IF YOU WANT TO DELETE ORPHANED PROJECTS:
-- DELETE FROM projects WHERE user_id NOT IN (SELECT id FROM profiles);

-- Option B: Reassign orphaned projects to a specific user
-- UNCOMMENT AND REPLACE 'YOUR_USER_ID' with your actual user ID:
-- UPDATE projects 
-- SET user_id = 'YOUR_USER_ID'
-- WHERE user_id NOT IN (SELECT id FROM profiles);

-- =====================================================
-- VERIFICATION COMPLETE
-- =====================================================

-- Final summary
SELECT 
  'Database Status' as check_type,
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM profiles) as profiles_created,
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM projects WHERE user_id IN (SELECT id FROM profiles)) as valid_projects,
  CASE 
    WHEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'projects' AND schemaname = 'public') 
    THEN '✓ Enabled' 
    ELSE '✗ Disabled' 
  END as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'projects') as policy_count;

-- You should see:
-- - profiles_created = total_users
-- - valid_projects = total_projects
-- - rls_status = '✓ Enabled'
-- - policy_count = 4

-- =====================================================
-- DONE!
-- =====================================================
-- After running this script:
-- 1. Log out and log back in to your app
-- 2. Navigate to /diagnostic to verify everything works
-- 3. Navigate to /projects to see your projects
-- =====================================================

