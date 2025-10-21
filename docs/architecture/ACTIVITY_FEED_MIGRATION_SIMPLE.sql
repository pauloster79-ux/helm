-- =====================================================
-- ASSISTANT PANE ACTIVITY FEED MIGRATION (SIMPLE)
-- =====================================================
-- This migration adds only the essential columns for activity types
-- Run this if the full migration has policy conflicts

-- =====================================================
-- ADD COLUMNS TO PROPOSALS TABLE
-- =====================================================

-- Add activity_type column
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'proposal'
CHECK (activity_type IN ('proposal', 'insight', 'question', 'answer'));

-- Add parent_id column for linking Q&A
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES proposals(id) ON DELETE CASCADE;

-- =====================================================
-- MAKE FIELDS OPTIONAL (FOR INSIGHTS AND Q&A)
-- =====================================================

-- Update proposal_type to be nullable (not needed for insights/Q&A)
ALTER TABLE proposals 
ALTER COLUMN proposal_type DROP NOT NULL;

-- Update component_type to allow null (Q&A may not be tied to a component)
ALTER TABLE proposals 
ALTER COLUMN component_type DROP NOT NULL;

-- Update confidence to allow null (insights may not have confidence scores)
ALTER TABLE proposals 
ALTER COLUMN confidence DROP NOT NULL;

-- Changes field should be nullable for insights and Q&A
ALTER TABLE proposals 
ALTER COLUMN changes DROP NOT NULL;

-- =====================================================
-- ADD INDEXES
-- =====================================================

-- Add index for activity_type queries
CREATE INDEX IF NOT EXISTS proposals_activity_type_idx ON proposals(activity_type);

-- Add index for parent_id (for Q&A lookups)
CREATE INDEX IF NOT EXISTS proposals_parent_id_idx ON proposals(parent_id) 
WHERE parent_id IS NOT NULL;

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS proposals_project_activity_status_idx 
ON proposals(project_id, activity_type, status);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check that columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'proposals' 
AND column_name IN ('activity_type', 'parent_id')
ORDER BY column_name;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Activity feed migration completed successfully!';
    RAISE NOTICE 'New columns added: activity_type, parent_id';
    RAISE NOTICE 'Fields made optional: proposal_type, component_type, confidence, changes';
    RAISE NOTICE 'Indexes created for performance';
END $$;
