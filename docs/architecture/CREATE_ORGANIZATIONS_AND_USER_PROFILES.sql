-- =====================================================
-- ORGANIZATIONS AND USER_PROFILES MIGRATION
-- =====================================================
-- This migration creates the organization infrastructure
-- that the app currently references but doesn't exist
--
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CREATE ORGANIZATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS organizations_slug_idx ON organizations(slug);
CREATE INDEX IF NOT EXISTS organizations_created_by_idx ON organizations(created_by);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 2: CREATE USER_PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one profile per user
  CONSTRAINT unique_user_profile UNIQUE (id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS user_profiles_org_idx ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role);
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: CREATE ORGANIZATION MEMBERS TABLE
-- =====================================================
-- For future multi-organization support

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'removed')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one membership per user per org
  CONSTRAINT unique_org_membership UNIQUE (organization_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS org_members_org_idx ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS org_members_user_idx ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS org_members_status_idx ON organization_members(status);

-- Enable RLS
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: RLS POLICIES FOR ORGANIZATIONS
-- =====================================================

-- Users can view organizations they belong to
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Only organization owners can update their organization
CREATE POLICY "Organization owners can update their organization"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Only owners can delete organizations
CREATE POLICY "Organization owners can delete their organization"
  ON organizations FOR DELETE
  USING (
    id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- =====================================================
-- STEP 5: RLS POLICIES FOR USER_PROFILES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view profiles in their organization
CREATE POLICY "Users can view profiles in their organization"
  ON user_profiles FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only admins and owners can update other users' profiles
CREATE POLICY "Admins can update profiles in their organization"
  ON user_profiles FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- STEP 6: RLS POLICIES FOR ORGANIZATION_MEMBERS
-- =====================================================

-- Users can view members of their organizations
CREATE POLICY "Users can view members of their organizations"
  ON organization_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Only admins and owners can manage members
CREATE POLICY "Admins can manage organization members"
  ON organization_members FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- =====================================================
-- STEP 7: MIGRATION FUNCTION - BACKFILL EXISTING USERS
-- =====================================================

CREATE OR REPLACE FUNCTION migrate_existing_users_to_organizations()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  org_id UUID;
  org_slug TEXT;
  user_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting migration of existing users to organizations...';
  
  -- Loop through all auth users
  FOR user_record IN 
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN user_profiles up ON u.id = up.id
    WHERE up.id IS NULL  -- Only users without profiles
  LOOP
    -- Create organization for user
    org_slug := LOWER(REGEXP_REPLACE(user_record.email, '[^a-zA-Z0-9]', '-', 'g'));
    
    -- Ensure slug is unique
    WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = org_slug) LOOP
      org_slug := org_slug || '-' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8);
    END LOOP;
    
    -- Create organization
    INSERT INTO organizations (name, slug, description, created_by)
    VALUES (
      COALESCE(user_record.raw_user_meta_data->>'full_name', 'My Organization'),
      org_slug,
      'Personal organization for ' || user_record.email,
      user_record.id
    )
    RETURNING id INTO org_id;
    
    -- Create user profile
    INSERT INTO user_profiles (id, organization_id, role, email, full_name, avatar_url)
    VALUES (
      user_record.id,
      org_id,
      'owner',
      user_record.email,
      user_record.raw_user_meta_data->>'full_name',
      user_record.raw_user_meta_data->>'avatar_url'
    );
    
    -- Create organization membership
    INSERT INTO organization_members (organization_id, user_id, role, status, joined_at)
    VALUES (org_id, user_record.id, 'owner', 'active', NOW());
    
    user_count := user_count + 1;
    RAISE NOTICE 'Migrated user: % (org: %)', user_record.email, org_slug;
  END LOOP;
  
  RAISE NOTICE 'Migration complete! Migrated % users.', user_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 8: TRIGGER TO AUTO-CREATE ORG ON USER SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user_with_organization()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
  org_slug TEXT;
BEGIN
  -- Create organization for new user
  org_slug := LOWER(REGEXP_REPLACE(NEW.email, '[^a-zA-Z0-9]', '-', 'g'));
  
  -- Ensure slug is unique
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = org_slug) LOOP
    org_slug := org_slug || '-' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8);
  END LOOP;
  
  -- Create organization
  INSERT INTO organizations (name, slug, description, created_by)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Organization'),
    org_slug,
    'Personal organization for ' || NEW.email,
    NEW.id
  )
  RETURNING id INTO org_id;
  
  -- Create user profile
  INSERT INTO user_profiles (id, organization_id, role, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    org_id,
    'owner',
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create organization membership
  INSERT INTO organization_members (organization_id, user_id, role, status, joined_at)
  VALUES (org_id, NEW.id, 'owner', 'active', NOW())
  ON CONFLICT (organization_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_with_organization();

-- =====================================================
-- STEP 9: TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 10: HELPER FUNCTIONS
-- =====================================================

-- Function to get user's organization ID
CREATE OR REPLACE FUNCTION get_user_organization_id(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM user_profiles 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has role in organization
CREATE OR REPLACE FUNCTION user_has_role(
  user_uuid UUID,
  org_uuid UUID,
  required_role TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = user_uuid 
    AND organization_id = org_uuid
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 11: RUN MIGRATION
-- =====================================================

-- Run the migration for existing users
SELECT migrate_existing_users_to_organizations();

-- =====================================================
-- STEP 12: VERIFICATION
-- =====================================================

DO $$
DECLARE
  org_count INTEGER;
  profile_count INTEGER;
  member_count INTEGER;
  auth_user_count INTEGER;
BEGIN
  -- Count records
  SELECT COUNT(*) INTO org_count FROM organizations;
  SELECT COUNT(*) INTO profile_count FROM user_profiles;
  SELECT COUNT(*) INTO member_count FROM organization_members;
  SELECT COUNT(*) INTO auth_user_count FROM auth.users;
  
  -- Display results
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'ORGANIZATION MIGRATION COMPLETE!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Auth Users: %', auth_user_count;
  RAISE NOTICE 'Organizations: %', org_count;
  RAISE NOTICE 'User Profiles: %', profile_count;
  RAISE NOTICE 'Organization Members: %', member_count;
  RAISE NOTICE '==============================================';
  
  -- Verify all users have profiles
  IF profile_count = auth_user_count THEN
    RAISE NOTICE '✓ All users have profiles';
  ELSE
    RAISE WARNING '✗ User profile count mismatch!';
  END IF;
  
  -- Verify all profiles have organizations
  IF org_count = profile_count THEN
    RAISE NOTICE '✓ All users have organizations';
  ELSE
    RAISE WARNING '✗ Organization count mismatch!';
  END IF;
END $$;

-- =====================================================
-- STEP 13: CLEANUP (Optional)
-- =====================================================

-- Drop the migration function after running (optional)
-- DROP FUNCTION IF EXISTS migrate_existing_users_to_organizations();

-- =====================================================
-- NOTES
-- =====================================================
-- After running this migration:
-- 1. All existing users will have their own organization
-- 2. New users will automatically get an organization on signup
-- 3. The user_profiles table now exists and can be queried
-- 4. RLS policies ensure users can only access their own data
-- 5. Organizations are isolated from each other
-- =====================================================

