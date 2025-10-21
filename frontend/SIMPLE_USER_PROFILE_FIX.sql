-- Simple fix for user profile - run this in Supabase SQL Editor

-- Step 1: Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simple policy (drop first to avoid conflicts)
DROP POLICY IF EXISTS "user_profiles_policy" ON user_profiles;
CREATE POLICY "user_profiles_policy" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Step 4: Insert user profile for your email
INSERT INTO user_profiles (user_id, organization_id)
SELECT 
  au.id,
  gen_random_uuid()
FROM auth.users au
WHERE au.email = 'pauloster79@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.user_id = au.id
  );

-- Step 5: Verify the profile was created
SELECT 
  up.id,
  up.user_id,
  up.organization_id,
  au.email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'pauloster79@gmail.com';
