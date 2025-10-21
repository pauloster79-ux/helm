-- AI Configuration Database Setup
-- Run this script in your Supabase SQL Editor if the ai_configurations table doesn't exist

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_configurations table
CREATE TABLE IF NOT EXISTS ai_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  component_type TEXT NULL, -- NULL = organization-level config, otherwise component-specific
  ai_provider TEXT NOT NULL DEFAULT 'openai' CHECK (ai_provider IN ('openai', 'anthropic')),
  ai_model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  validation_scope TEXT NOT NULL DEFAULT 'selective' CHECK (validation_scope IN ('rules_only', 'selective', 'full')),
  proposal_timing TEXT NOT NULL DEFAULT 'realtime' CHECK (proposal_timing IN ('realtime', 'batch', 'on_demand')),
  proposal_threshold TEXT NOT NULL DEFAULT 'medium' CHECK (proposal_threshold IN ('low', 'medium', 'high')),
  cost_limit_daily NUMERIC,
  cost_limit_monthly NUMERIC,
  alert_threshold_percentage INTEGER NOT NULL DEFAULT 80 CHECK (alert_threshold_percentage > 0 AND alert_threshold_percentage <= 100),
  enable_field_validation BOOLEAN NOT NULL DEFAULT true,
  enable_component_validation BOOLEAN NOT NULL DEFAULT true,
  enable_daily_analysis BOOLEAN NOT NULL DEFAULT false,
  assessment_prompt_system TEXT,
  assessment_prompt_categories TEXT,
  assessment_prompt_output_format TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Unique constraint: one config per organization per component_type
  CONSTRAINT unique_org_component UNIQUE (organization_id, component_type)
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    -- Add assessment_prompt_system column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_configurations' 
                   AND column_name = 'assessment_prompt_system') THEN
        ALTER TABLE ai_configurations ADD COLUMN assessment_prompt_system TEXT;
    END IF;
    
    -- Add assessment_prompt_categories column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_configurations' 
                   AND column_name = 'assessment_prompt_categories') THEN
        ALTER TABLE ai_configurations ADD COLUMN assessment_prompt_categories TEXT;
    END IF;
    
    -- Add assessment_prompt_output_format column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_configurations' 
                   AND column_name = 'assessment_prompt_output_format') THEN
        ALTER TABLE ai_configurations ADD COLUMN assessment_prompt_output_format TEXT;
    END IF;
    
    -- Add enable_daily_analysis column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_configurations' 
                   AND column_name = 'enable_daily_analysis') THEN
        ALTER TABLE ai_configurations ADD COLUMN enable_daily_analysis BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_configurations_org ON ai_configurations(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_configurations_component ON ai_configurations(component_type);

-- Enable Row Level Security
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their organization's AI configurations"
  ON ai_configurations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert AI configurations for their organization"
  ON ai_configurations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their organization's AI configurations"
  ON ai_configurations FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their organization's AI configurations"
  ON ai_configurations FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_configurations_updated_at
  BEFORE UPDATE ON ai_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a default organization if none exists
INSERT INTO organizations (id, name, slug)
VALUES (
  'default-org'::uuid,
  'Default Organization',
  'default-org'
)
ON CONFLICT (slug) DO NOTHING;

-- Verify the setup
SELECT 
  'ai_configurations' as table_name,
  COUNT(*) as row_count
FROM ai_configurations
UNION ALL
SELECT 
  'organizations' as table_name,
  COUNT(*) as row_count
FROM organizations
UNION ALL
SELECT 
  'user_profiles' as table_name,
  COUNT(*) as row_count
FROM user_profiles;

-- Success message
SELECT 'Database setup complete! You can now save AI configurations.' as message;
