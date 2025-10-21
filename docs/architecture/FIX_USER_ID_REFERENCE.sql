-- Fix user_id reference in projects table
-- The projects table should reference auth.users(id) directly, not profiles(id)

-- First, drop the existing foreign key constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;

-- Update the user_id column to reference auth.users(id) instead of profiles(id)
ALTER TABLE projects 
ALTER COLUMN user_id TYPE UUID,
ADD CONSTRAINT projects_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Also update the RLS policies to use auth.uid() directly
-- Drop existing policies
DROP POLICY IF EXISTS "Users can select their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Recreate policies with correct auth.uid() reference
CREATE POLICY "Users can select their own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON projects FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
ON projects FOR DELETE
USING (auth.uid() = user_id);
