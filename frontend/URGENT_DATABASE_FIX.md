# 🚨 URGENT: Database Schema Fix Required

## The Problem
Your application is showing these errors:
- "Failed to fetch tasks: column tasks.parent_task_id does not exist"
- "Failed to create task: Could not find the 'due_date' column of 'tasks' in the schema cache"

## The Solution
You need to apply the enhanced database schema to your Supabase project.

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**

### Step 2: Apply the Schema
1. Copy the entire contents of `docs/architecture/PHASE_2B_TASK_SCHEMA_UPDATE.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** to execute

### Step 3: Verify
After running the SQL, your tasks table should have these new columns:
- `parent_task_id`
- `due_date`
- `progress_percentage`
- `owner_id`
- `latest_position`
- `completed_at`
- `deleted_at`

## What This Fixes
- ✅ Task creation will work
- ✅ Task fetching will work
- ✅ All enhanced task features will be available
- ✅ No more database errors

**This is the most critical fix needed right now!**
