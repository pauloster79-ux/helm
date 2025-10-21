-- Ultra Minimal Migration - Just Add Columns
-- No indexes, no constraints, no policies

ALTER TABLE proposals ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'proposal';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS parent_id UUID;
