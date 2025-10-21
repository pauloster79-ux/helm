-- Fix Missing Columns in ai_configurations Table
-- Run this script in your Supabase SQL Editor to add the missing columns

-- Add missing columns to existing ai_configurations table
ALTER TABLE ai_configurations 
ADD COLUMN IF NOT EXISTS assessment_prompt_system TEXT,
ADD COLUMN IF NOT EXISTS assessment_prompt_categories TEXT,
ADD COLUMN IF NOT EXISTS assessment_prompt_output_format TEXT,
ADD COLUMN IF NOT EXISTS enable_daily_analysis BOOLEAN NOT NULL DEFAULT false;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'ai_configurations' 
AND column_name IN (
  'assessment_prompt_system', 
  'assessment_prompt_categories', 
  'assessment_prompt_output_format',
  'enable_daily_analysis'
)
ORDER BY column_name;

-- Success message
SELECT 'Missing columns added successfully! You can now save AI configurations.' as message;
