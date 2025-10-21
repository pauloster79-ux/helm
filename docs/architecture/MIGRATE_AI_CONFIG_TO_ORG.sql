-- Migration: Move AI Configuration from Project-Level to Organization-Level
-- This migration changes ai_configurations to be organization-scoped instead of project-scoped
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: Create new ai_configurations table structure
-- =====================================================

-- First, drop the old table (if it exists) and recreate with new structure
-- NOTE: This will lose existing data, so we'll back it up first

-- Create backup of existing configurations (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_configurations') THEN
    CREATE TABLE ai_configurations_backup AS SELECT * FROM ai_configurations;
    RAISE NOTICE 'Backed up existing ai_configurations table';
  END IF;
END $$;

-- Drop existing table and constraints
DROP TABLE IF EXISTS ai_configurations CASCADE;

-- Create new ai_configurations table with organization_id
CREATE TABLE ai_configurations (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Unique constraint: one config per organization per component_type
  CONSTRAINT unique_org_component UNIQUE (organization_id, component_type)
);

-- Create index for faster queries
CREATE INDEX idx_ai_configurations_org ON ai_configurations(organization_id);
CREATE INDEX idx_ai_configurations_component ON ai_configurations(component_type);

-- =====================================================
-- STEP 2: Migrate existing data (if backup exists)
-- =====================================================

DO $$
DECLARE
  config_record RECORD;
  org_id UUID;
  existing_org_config UUID;
BEGIN
  -- Check if backup table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_configurations_backup') THEN
    RAISE NOTICE 'Migrating data from backup...';
    
    -- For each distinct organization, take the first project's config as the org default
    FOR config_record IN 
      SELECT DISTINCT ON (p.organization_id)
        p.organization_id,
        c.component_type,
        c.ai_provider,
        c.ai_model,
        c.validation_scope,
        c.proposal_timing,
        c.proposal_threshold,
        c.cost_limit_daily,
        c.cost_limit_monthly,
        c.alert_threshold_percentage,
        c.enable_field_validation,
        c.enable_component_validation,
        c.enable_daily_analysis,
        c.updated_by
      FROM ai_configurations_backup c
      JOIN projects p ON c.project_id = p.id
      WHERE c.component_type IS NULL  -- Only migrate organization-level configs
      ORDER BY p.organization_id, c.created_at ASC
    LOOP
      -- Check if config already exists for this org
      SELECT id INTO existing_org_config
      FROM ai_configurations
      WHERE organization_id = config_record.organization_id
        AND component_type IS NULL;
      
      -- Only insert if doesn't exist
      IF existing_org_config IS NULL THEN
        INSERT INTO ai_configurations (
          organization_id,
          component_type,
          ai_provider,
          ai_model,
          validation_scope,
          proposal_timing,
          proposal_threshold,
          cost_limit_daily,
          cost_limit_monthly,
          alert_threshold_percentage,
          enable_field_validation,
          enable_component_validation,
          enable_daily_analysis,
          updated_by
        ) VALUES (
          config_record.organization_id,
          config_record.component_type,
          config_record.ai_provider,
          config_record.ai_model,
          config_record.validation_scope,
          config_record.proposal_timing,
          config_record.proposal_threshold,
          config_record.cost_limit_daily,
          config_record.cost_limit_monthly,
          config_record.alert_threshold_percentage,
          config_record.enable_field_validation,
          config_record.enable_component_validation,
          config_record.enable_daily_analysis,
          config_record.updated_by
        );
        
        RAISE NOTICE 'Migrated config for organization: %', config_record.organization_id;
      END IF;
    END LOOP;
    
    RAISE NOTICE 'Migration complete. You can now drop ai_configurations_backup if everything looks good.';
  ELSE
    RAISE NOTICE 'No backup table found. This is a fresh installation.';
  END IF;
END $$;

-- =====================================================
-- STEP 3: Row-Level Security Policies
-- =====================================================

-- Enable RLS
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;

-- Users can view configurations for their organization
CREATE POLICY "Users can view their organization's AI configurations"
  ON ai_configurations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert configurations for their organization
CREATE POLICY "Users can insert their organization's AI configurations"
  ON ai_configurations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Users can update configurations for their organization
CREATE POLICY "Users can update their organization's AI configurations"
  ON ai_configurations FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Users can delete configurations for their organization
CREATE POLICY "Users can delete their organization's AI configurations"
  ON ai_configurations FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- STEP 4: Triggers
-- =====================================================

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER update_ai_configurations_updated_at
  BEFORE UPDATE ON ai_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 5: Verification
-- =====================================================

-- Verify the migration
DO $$
DECLARE
  config_count INTEGER;
  org_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO config_count FROM ai_configurations;
  SELECT COUNT(DISTINCT organization_id) INTO org_count FROM ai_configurations;
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'AI Configuration Migration Complete!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Total configurations: %', config_count;
  RAISE NOTICE 'Organizations with configs: %', org_count;
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'You can now drop the backup table with:';
  RAISE NOTICE 'DROP TABLE IF EXISTS ai_configurations_backup;';
END $$;

-- =====================================================
-- CLEANUP (Optional - run after verification)
-- =====================================================

-- Uncomment the line below after verifying the migration is successful
-- DROP TABLE IF EXISTS ai_configurations_backup;

