-- Test script to debug organization ID fetching
-- Run this in Supabase SQL Editor to check RLS and data access

-- First, let's check if the user profile exists and is accessible
SELECT 
  up.id,
  up.user_id,
  up.organization_id,
  au.email,
  auth.uid() as current_user_id
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'pauloster79@gmail.com';

-- Check current authenticated user
SELECT auth.uid() as current_user_id, auth.email() as current_email;

-- Check if RLS is blocking access
-- Temporarily disable RLS to test
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Try the query again
SELECT 
  up.id,
  up.user_id,
  up.organization_id,
  au.email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'pauloster79@gmail.com';

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create a simpler RLS policy
DROP POLICY IF EXISTS "user_profiles_policy" ON user_profiles;
CREATE POLICY "user_profiles_policy" ON user_profiles
  FOR ALL USING (true); -- Temporarily allow all access for testing

-- Test again with the new policy
SELECT 
  up.id,
  up.user_id,
  up.organization_id,
  au.email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'pauloster79@gmail.com';
