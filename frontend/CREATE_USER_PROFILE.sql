-- Create user profile for authenticated user if it doesn't exist
-- Run this in your Supabase SQL Editor

-- First, check if user_profiles table exists and has the right structure
-- If not, create it:
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create new RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert user profile for pauloster79@gmail.com if it doesn't exist
INSERT INTO user_profiles (user_id, organization_id)
SELECT 
  au.id,
  gen_random_uuid() -- Generate a random UUID for organization_id
FROM auth.users au
WHERE au.email = 'pauloster79@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.user_id = au.id
  );

-- Check if the profile was created
SELECT 
  up.id,
  up.user_id,
  up.organization_id,
  au.email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'pauloster79@gmail.com';
