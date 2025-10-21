-- =====================================================
-- ASSISTANT PANE ACTIVITY FEED MIGRATION
-- =====================================================
-- This migration extends the proposals table to support:
-- - Actionable proposals
-- - Non-actionable insights
-- - Q&A interactions
--
-- Apply this after PHASE_2B_TASK_SCHEMA_UPDATE.sql

-- =====================================================
-- EXTEND PROPOSALS TABLE
-- =====================================================

-- Add activity_type column to distinguish between proposals, insights, and Q&A
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'proposal'
CHECK (activity_type IN ('proposal', 'insight', 'question', 'answer'));

-- Add parent_id column for linking Q&A (answers link to questions)
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES proposals(id) ON DELETE CASCADE;

-- Add index for activity_type queries
CREATE INDEX IF NOT EXISTS proposals_activity_type_idx ON proposals(activity_type);

-- Add index for parent_id (for Q&A lookups)
CREATE INDEX IF NOT EXISTS proposals_parent_id_idx ON proposals(parent_id) 
WHERE parent_id IS NOT NULL;

-- Add composite index for common queries (project + activity type + status)
CREATE INDEX IF NOT EXISTS proposals_project_activity_status_idx 
ON proposals(project_id, activity_type, status);

-- =====================================================
-- UPDATE CONSTRAINTS
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
-- ADD CHECK CONSTRAINTS
-- =====================================================

-- Ensure proposals have required fields
ALTER TABLE proposals
ADD CONSTRAINT proposal_required_fields CHECK (
  activity_type != 'proposal' OR 
  (proposal_type IS NOT NULL AND component_type IS NOT NULL AND changes IS NOT NULL AND confidence IS NOT NULL)
);

-- Ensure answers have a parent_id (question)
ALTER TABLE proposals
ADD CONSTRAINT answer_has_parent CHECK (
  activity_type != 'answer' OR parent_id IS NOT NULL
);

-- Ensure questions don't have a parent_id
ALTER TABLE proposals
ADD CONSTRAINT question_no_parent CHECK (
  activity_type != 'question' OR parent_id IS NULL
);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to create a Q&A pair
CREATE OR REPLACE FUNCTION create_question(
  project_id_param UUID,
  question_text TEXT,
  user_id_param UUID
)
RETURNS UUID AS $$
DECLARE
  question_id UUID;
BEGIN
  -- Validate question text
  IF length(trim(question_text)) = 0 THEN
    RAISE EXCEPTION 'Question cannot be empty';
  END IF;
  
  IF length(question_text) > 5000 THEN
    RAISE EXCEPTION 'Question cannot exceed 5000 characters';
  END IF;
  
  -- Insert question
  INSERT INTO proposals (
    project_id,
    activity_type,
    rationale, -- Store question in rationale field
    status,
    created_at
  ) VALUES (
    project_id_param,
    'question',
    trim(question_text),
    'pending', -- Questions are pending until answered
    NOW()
  ) RETURNING id INTO question_id;
  
  RETURN question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add an answer to a question
CREATE OR REPLACE FUNCTION create_answer(
  question_id_param UUID,
  answer_text TEXT,
  evidence_array TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS UUID AS $$
DECLARE
  answer_id UUID;
  project_id_val UUID;
BEGIN
  -- Validate answer text
  IF length(trim(answer_text)) = 0 THEN
    RAISE EXCEPTION 'Answer cannot be empty';
  END IF;
  
  -- Get project_id from the question
  SELECT project_id INTO project_id_val
  FROM proposals 
  WHERE id = question_id_param AND activity_type = 'question';
  
  IF project_id_val IS NULL THEN
    RAISE EXCEPTION 'Question not found';
  END IF;
  
  -- Insert answer
  INSERT INTO proposals (
    project_id,
    activity_type,
    parent_id,
    rationale, -- Store answer in rationale field
    evidence, -- Store sources/evidence
    status,
    created_at
  ) VALUES (
    project_id_val,
    'answer',
    question_id_param,
    trim(answer_text),
    to_jsonb(evidence_array),
    'accepted', -- Answers are automatically "accepted" (displayed)
    NOW()
  ) RETURNING id INTO answer_id;
  
  -- Mark the question as accepted (answered)
  UPDATE proposals 
  SET status = 'accepted', reviewed_at = NOW()
  WHERE id = question_id_param;
  
  RETURN answer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create an insight
CREATE OR REPLACE FUNCTION create_insight(
  project_id_param UUID,
  insight_title TEXT,
  insight_description TEXT,
  component_type_param TEXT DEFAULT NULL,
  component_id_param UUID DEFAULT NULL,
  evidence_array TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS UUID AS $$
DECLARE
  insight_id UUID;
BEGIN
  -- Validate inputs
  IF length(trim(insight_title)) = 0 THEN
    RAISE EXCEPTION 'Insight title cannot be empty';
  END IF;
  
  IF length(trim(insight_description)) = 0 THEN
    RAISE EXCEPTION 'Insight description cannot be empty';
  END IF;
  
  -- Insert insight
  INSERT INTO proposals (
    project_id,
    activity_type,
    component_type,
    component_id,
    rationale, -- Store insight description in rationale field
    evidence,
    status,
    created_at
  ) VALUES (
    project_id_param,
    'insight',
    component_type_param,
    component_id_param,
    insight_title || E'\n\n' || trim(insight_description),
    to_jsonb(evidence_array),
    'pending', -- Insights can be marked as read/dismissed
    NOW()
  ) RETURNING id INTO insight_id;
  
  RETURN insight_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UPDATE RLS POLICIES
-- =====================================================

-- No changes needed - existing RLS policies already filter by project_id,
-- which ensures users only see activities for their own projects

-- If you encounter policy conflicts, you can drop and recreate them:
-- DROP POLICY IF EXISTS "Users can view proposals for their projects" ON proposals;
-- CREATE POLICY "Users can view proposals for their projects"
--   ON proposals FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM projects 
--       WHERE projects.id = proposals.project_id 
--       AND projects.user_id = auth.uid()
--     )
--   );

-- =====================================================
-- VERIFICATION QUERIES
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

-- =====================================================
-- NOTES
-- =====================================================

-- To apply this migration:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" to execute
-- 4. Verify columns were added successfully
-- 5. Update TypeScript types with: npx supabase gen types typescript

-- Data model:
-- - activity_type = 'proposal': Traditional actionable proposals
-- - activity_type = 'insight': Non-actionable AI observations
-- - activity_type = 'question': User questions (linked to project)
-- - activity_type = 'answer': AI answers (parent_id points to question)

-- Fields usage by activity type:
-- PROPOSAL: Uses all existing fields (proposal_type, changes, confidence, etc.)
-- INSIGHT: Uses rationale (title+description), evidence, component_type/id (optional)
-- QUESTION: Uses rationale (question text), project_id
-- ANSWER: Uses rationale (answer text), evidence, parent_id (points to question)

