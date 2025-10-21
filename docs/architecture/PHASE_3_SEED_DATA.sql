-- =============================================
-- HELM PHASE 3: SEED DATA FOR DEVELOPMENT
-- =============================================
-- Run this AFTER running PHASE_3_DATABASE_MIGRATION.sql
-- This populates initial data for testing AI features

-- =============================================
-- INSTRUCTIONS
-- =============================================
-- 1. Replace 'YOUR_ORGANIZATION_ID_HERE' with an actual organization ID from your organizations table
-- 2. Replace 'YOUR_PROJECT_ID_HERE' with an actual project ID from your projects table
-- 3. Replace 'YOUR_USER_ID_HERE' with an actual user ID from your profiles table
-- 4. Replace 'YOUR_TASK_ID_HERE' with an actual task ID from your tasks table
-- 5. Run this in your Supabase SQL Editor

-- =============================================
-- DEFAULT AI CONFIGURATIONS (ORGANIZATION-LEVEL)
-- =============================================
-- NOTE: AI configurations are now organization-scoped, not project-scoped.
-- Settings apply to all projects within the organization.

-- Organization-level default configuration (applies to all components unless overridden)
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
    enable_daily_analysis
) VALUES (
    'YOUR_ORGANIZATION_ID_HERE', -- Replace with actual organization ID
    NULL, -- NULL = organization-level default
    'openai',
    'gpt-4o-mini',
    'selective', -- Balanced approach
    'realtime', -- Generate proposals immediately
    'medium', -- Show medium and high confidence proposals
    5.00, -- $5/day limit
    100.00, -- $100/month limit
    80, -- Alert at 80% of limit
    true, -- Enable field validation
    true, -- Enable component validation
    false -- Daily analysis is Phase 4
) ON CONFLICT (organization_id, component_type) DO NOTHING;

-- Task-specific override (use more thorough validation for tasks within this organization)
INSERT INTO ai_configurations (
    organization_id,
    component_type,
    ai_provider,
    ai_model,
    validation_scope,
    proposal_timing,
    proposal_threshold,
    cost_limit_daily,
    cost_limit_monthly
) VALUES (
    'YOUR_ORGANIZATION_ID_HERE', -- Replace with actual organization ID
    'task',
    'openai',
    'gpt-4o', -- Use more powerful model for tasks
    'full', -- Full context for comprehensive analysis
    'realtime',
    'high', -- Only show high-confidence proposals for tasks
    10.00, -- Higher limit for task validation
    200.00
) ON CONFLICT (organization_id, component_type) DO NOTHING;

-- =============================================
-- EXAMPLE PROPOSALS (for UI development)
-- =============================================

-- Example 1: Field improvement proposal (vague title)
INSERT INTO proposals (
    project_id,
    proposal_type,
    component_type,
    component_id,
    changes,
    rationale,
    confidence,
    evidence,
    source_type,
    status,
    estimated_impact
) VALUES (
    'YOUR_PROJECT_ID_HERE',
    'field_improvement',
    'task',
    'YOUR_TASK_ID_HERE', -- Replace with actual task ID
    jsonb_build_object(
        'field', 'title',
        'current_value', 'fix bug',
        'proposed_value', 'Fix authentication timeout bug in SSO login flow'
    ),
    'The title is too vague. A specific title helps with tracking, prioritization, and understanding the scope without reading the full description. Best practice is to clearly state WHAT is being fixed and WHERE.',
    'high',
    jsonb_build_array(
        'Best practice: titles should be specific and actionable',
        'Similar tasks in this project use detailed titles',
        'PM Guide recommends including affected component in title'
    ),
    'ai_analysis',
    'pending',
    'Updates task visibility and searchability in reports'
);

-- Example 2: Missing information proposal
INSERT INTO proposals (
    project_id,
    proposal_type,
    component_type,
    component_id,
    changes,
    rationale,
    confidence,
    evidence,
    source_type,
    status,
    estimated_impact
) VALUES (
    'YOUR_PROJECT_ID_HERE',
    'missing_information',
    'task',
    'YOUR_TASK_ID_HERE',
    jsonb_build_object(
        'field', 'description',
        'proposed_value', 'Add acceptance criteria:

1. User can successfully log in via SSO
2. Session token persists for 24 hours
3. Refresh token mechanism works correctly
4. Timeout errors are properly logged
5. User sees clear error message on timeout'
    ),
    'The task description lacks clear acceptance criteria. Adding specific, testable criteria helps developers know when the task is complete and QA understand what to test.',
    'medium',
    jsonb_build_array(
        'Agile best practice: tasks should have clear done criteria',
        'Pattern observed: high-priority tasks in this project typically have 3-5 acceptance criteria'
    ),
    'ai_analysis',
    'pending',
    'Improves task clarity and reduces back-and-forth during development'
);

-- Example 3: Relationship suggestion (dependency)
INSERT INTO proposals (
    project_id,
    proposal_type,
    component_type,
    component_id,
    changes,
    rationale,
    confidence,
    evidence,
    source_type,
    status,
    estimated_impact
) VALUES (
    'YOUR_PROJECT_ID_HERE',
    'relationship_suggestion',
    'task',
    'YOUR_TASK_ID_HERE',
    jsonb_build_object(
        'relationship_type', 'dependency',
        'related_component_id', 'RELATED_TASK_ID_HERE', -- ID of the task this depends on
        'dependency_type', 'finish_to_start',
        'rationale', 'Must complete SSO configuration updates before fixing timeout issues'
    ),
    'Detected a logical dependency. This task references "SSO login flow" which is being updated in Task T-23. Consider adding a dependency to ensure proper sequencing.',
    'medium',
    jsonb_build_array(
        'Both tasks reference SSO authentication',
        'Task T-23 is updating SSO configuration',
        'This task fixes bugs in SSO flow'
    ),
    'ai_analysis',
    'pending',
    'Prevents conflicts and ensures proper implementation order'
);

-- Example 4: Accepted proposal (for showing history)
INSERT INTO proposals (
    project_id,
    proposal_type,
    component_type,
    component_id,
    changes,
    rationale,
    confidence,
    evidence,
    source_type,
    status,
    reviewed_by,
    reviewed_at,
    feedback,
    estimated_impact
) VALUES (
    'YOUR_PROJECT_ID_HERE',
    'field_improvement',
    'task',
    'YOUR_TASK_ID_HERE',
    jsonb_build_object(
        'field', 'priority',
        'current_value', 'medium',
        'proposed_value', 'high'
    ),
    'This task blocks 3 other tasks and affects the critical authentication flow. Recommend increasing priority to ensure timely completion.',
    'high',
    jsonb_build_array(
        'Task blocks: T-24, T-25, T-26',
        'Affects critical path',
        'Authentication is a P0 feature for launch'
    ),
    'ai_analysis',
    'accepted',
    'YOUR_USER_ID_HERE', -- Replace with actual user ID
    NOW() - INTERVAL '1 day',
    'Good catch. This is indeed blocking several tasks.',
    'Increased task priority and moved up in backlog'
);

-- Example 5: Rejected proposal (for showing history)
INSERT INTO proposals (
    project_id,
    proposal_type,
    component_type,
    component_id,
    changes,
    rationale,
    confidence,
    evidence,
    source_type,
    status,
    reviewed_by,
    reviewed_at,
    feedback,
    estimated_impact
) VALUES (
    'YOUR_PROJECT_ID_HERE',
    'field_improvement',
    'task',
    'YOUR_TASK_ID_HERE',
    jsonb_build_object(
        'field', 'estimated_hours',
        'current_value', null,
        'proposed_value', 8
    ),
    'Based on similar tasks, this work typically takes 6-10 hours. Suggest adding time estimate.',
    'low',
    jsonb_build_array(
        'Similar bug fixes took 7h, 9h, and 6h',
        'Task has medium complexity'
    ),
    'ai_analysis',
    'rejected',
    'YOUR_USER_ID_HERE',
    NOW() - INTERVAL '2 days',
    'We don''t estimate bug fixes in hours, we use story points.',
    NULL
);

-- =============================================
-- EXAMPLE AI USAGE LOGS (for cost tracking UI)
-- =============================================

-- Example: Successful field validation
INSERT INTO ai_usage_logs (
    project_id,
    operation_type,
    component_type,
    component_id,
    ai_provider,
    ai_model,
    input_tokens,
    output_tokens,
    total_tokens,
    estimated_cost,
    latency_ms,
    success,
    proposal_ids,
    timestamp
) VALUES (
    'YOUR_PROJECT_ID_HERE',
    'task_validation',
    'task',
    'YOUR_TASK_ID_HERE',
    'openai',
    'gpt-4o-mini',
    250, -- Input tokens
    150, -- Output tokens
    400, -- Total tokens
    0.000060, -- Cost: 400 tokens * $0.15/1M = $0.00006
    2340, -- 2.34 seconds
    true,
    ARRAY[]::UUID[], -- No proposal IDs yet (would be filled in real operation)
    NOW() - INTERVAL '1 hour'
);

-- Example: Component-level validation with proposals
INSERT INTO ai_usage_logs (
    project_id,
    operation_type,
    component_type,
    component_id,
    ai_provider,
    ai_model,
    input_tokens,
    output_tokens,
    total_tokens,
    estimated_cost,
    latency_ms,
    success,
    proposal_ids,
    timestamp
) VALUES (
    'YOUR_PROJECT_ID_HERE',
    'task_validation',
    'task',
    'YOUR_TASK_ID_HERE',
    'openai',
    'gpt-4o',
    1200, -- More tokens for full context
    800,
    2000,
    0.022000, -- GPT-4o is more expensive: (1200 * 5 + 800 * 15) / 1M = $0.022
    5600, -- 5.6 seconds
    true,
    ARRAY[]::UUID[], -- In real scenario, would contain proposal UUIDs
    NOW() - INTERVAL '30 minutes'
);

-- Example: Failed operation (for error tracking)
INSERT INTO ai_usage_logs (
    project_id,
    operation_type,
    component_type,
    component_id,
    ai_provider,
    ai_model,
    input_tokens,
    output_tokens,
    total_tokens,
    estimated_cost,
    latency_ms,
    success,
    error_message,
    proposal_ids,
    timestamp
) VALUES (
    'YOUR_PROJECT_ID_HERE',
    'task_validation',
    'task',
    'YOUR_TASK_ID_HERE',
    'openai',
    'gpt-4o-mini',
    300,
    0, -- No output due to error
    300,
    0.000045, -- Only charged for input
    15000, -- 15 seconds (timeout)
    false,
    'OpenAI API timeout after 15 seconds',
    ARRAY[]::UUID[],
    NOW() - INTERVAL '2 hours'
);

-- Add more usage logs to simulate activity
INSERT INTO ai_usage_logs (
    project_id,
    operation_type,
    component_type,
    ai_provider,
    ai_model,
    input_tokens,
    output_tokens,
    total_tokens,
    estimated_cost,
    latency_ms,
    success,
    timestamp
) 
SELECT 
    'YOUR_PROJECT_ID_HERE',
    'task_validation',
    'task',
    'openai',
    'gpt-4o-mini',
    200 + floor(random() * 300)::int, -- Random input tokens 200-500
    100 + floor(random() * 200)::int, -- Random output tokens 100-300
    300 + floor(random() * 500)::int, -- Random total tokens 300-800
    0.000030 + (random() * 0.000070), -- Random cost $0.00003-$0.0001
    1000 + floor(random() * 4000)::int, -- Random latency 1-5 seconds
    true,
    NOW() - (random() * INTERVAL '7 days') -- Random timestamp within last week
FROM generate_series(1, 20); -- Generate 20 sample logs

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check AI configurations
SELECT 
    project_id,
    component_type,
    ai_provider,
    ai_model,
    validation_scope,
    cost_limit_daily,
    cost_limit_monthly
FROM ai_configurations
ORDER BY component_type NULLS FIRST;

-- Check proposals
SELECT 
    proposal_type,
    component_type,
    confidence,
    status,
    created_at
FROM proposals
ORDER BY created_at DESC;

-- Check usage logs and calculate total cost
SELECT 
    COUNT(*) as operation_count,
    SUM(total_tokens) as total_tokens,
    SUM(estimated_cost) as total_cost,
    AVG(latency_ms) as avg_latency_ms,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as success_count,
    SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as error_count
FROM ai_usage_logs;

-- Daily cost breakdown
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as operations,
    SUM(estimated_cost) as daily_cost,
    ai_model
FROM ai_usage_logs
GROUP BY DATE(timestamp), ai_model
ORDER BY date DESC, ai_model;

-- Success message
DO $$
DECLARE
    config_count INTEGER;
    proposal_count INTEGER;
    log_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO config_count FROM ai_configurations;
    SELECT COUNT(*) INTO proposal_count FROM proposals;
    SELECT COUNT(*) INTO log_count FROM ai_usage_logs;
    
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Phase 3 seed data loaded successfully!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'AI Configurations: %', config_count;
    RAISE NOTICE 'Sample Proposals: %', proposal_count;
    RAISE NOTICE 'Sample Usage Logs: %', log_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update database.types.ts with new table types';
    RAISE NOTICE '2. Test proposals display in UI';
    RAISE NOTICE '3. Set up FastAPI AI service';
END $$;


