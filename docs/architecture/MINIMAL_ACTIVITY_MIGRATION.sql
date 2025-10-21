-- Minimal Activity Feed Migration
-- Only adds the essential columns, no policies or functions

-- Add activity_type column
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'proposal';

-- Add parent_id column for Q&A linking  
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES proposals(id) ON DELETE CASCADE;

-- Make proposal fields nullable for insights/Q&A
ALTER TABLE proposals ALTER COLUMN proposal_type DROP NOT NULL;
ALTER TABLE proposals ALTER COLUMN component_type DROP NOT NULL; 
ALTER TABLE proposals ALTER COLUMN confidence DROP NOT NULL;
ALTER TABLE proposals ALTER COLUMN changes DROP NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS proposals_activity_type_idx ON proposals(activity_type);
CREATE INDEX IF NOT EXISTS proposals_parent_id_idx ON proposals(parent_id) WHERE parent_id IS NOT NULL;
