# Database Schema Application Guide

## 🗄️ Step 1: Apply the Enhanced Task Schema

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your Helm project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Apply the Schema**
   - Copy the entire contents of `docs/architecture/PHASE_2B_TASK_SCHEMA_UPDATE.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the schema

### Option B: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db reset
supabase db push
```

## 🔍 Step 2: Verify Schema Application

Run these queries to verify the schema was applied correctly:

### Check New Columns
```sql
-- Check if new columns exist in tasks table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tasks'
ORDER BY ordinal_position;
```

### Check New Table
```sql
-- Check if task_dependencies table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'task_dependencies';
```

### Check Functions
```sql
-- Check if new functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN (
  'check_circular_dependency', 
  'update_task_completion', 
  'add_latest_position',
  'get_task_hierarchy',
  'soft_delete_task'
);
```

### Check Indexes
```sql
-- Check if new indexes exist
SELECT indexname, tablename, indexdef
FROM pg_indexes
WHERE tablename IN ('tasks', 'task_dependencies')
ORDER BY tablename, indexname;
```

## 🧪 Step 3: Test Database Functions

### Test Task Creation with New Fields
```sql
-- First, get a valid project_id and user_id
SELECT id FROM projects LIMIT 1;
SELECT id FROM profiles LIMIT 1;

-- Test task creation with new fields
INSERT INTO tasks (
  project_id, 
  user_id, 
  title, 
  description, 
  status, 
  priority, 
  progress_percentage,
  due_date
) VALUES (
  'your-project-id-here',
  'your-user-id-here', 
  'Test Enhanced Task',
  'This is a test task with enhanced features',
  'todo',
  'high',
  25,
  NOW() + INTERVAL '7 days'
) RETURNING *;
```

### Test Latest Position Addition
```sql
-- Test latest position addition (replace with actual task_id)
SELECT add_latest_position(
  'your-task-id-here',
  'Started working on the task. Made good progress on the initial setup.',
  'your-user-id-here'
);
```

### Test Task Hierarchy
```sql
-- Test task hierarchy function
SELECT * FROM get_task_hierarchy('your-task-id-here');
```

### Test Soft Delete
```sql
-- Test soft delete function
SELECT soft_delete_task('your-task-id-here');
```

## 🔒 Step 4: Verify RLS Policies

### Check RLS is Enabled
```sql
-- Check RLS is enabled on tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('tasks', 'task_dependencies');
```

### Check Policies Exist
```sql
-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('tasks', 'task_dependencies')
ORDER BY tablename, policyname;
```

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Permission Errors
**Error**: `permission denied for table tasks`
**Solution**: 
- Ensure you're using the service role key for schema changes
- Check that your user has the necessary permissions

#### 2. Constraint Violations
**Error**: `foreign key constraint fails`
**Solution**:
- Verify that referenced tables (projects, profiles) exist
- Check that the referenced IDs are valid

#### 3. Function Errors
**Error**: `function uuid_generate_v4() does not exist`
**Solution**:
```sql
-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### 4. Column Already Exists
**Error**: `column "progress_percentage" already exists`
**Solution**: The schema uses `IF NOT EXISTS` clauses, so this shouldn't happen, but if it does:
```sql
-- Check existing columns
\d tasks
```

### Rollback (if needed)

⚠️ **WARNING**: This will delete data! Only use if you need to completely rollback.

```sql
-- Remove new columns (be careful - this will delete data!)
ALTER TABLE tasks DROP COLUMN IF EXISTS progress_percentage;
ALTER TABLE tasks DROP COLUMN IF EXISTS parent_task_id;
ALTER TABLE tasks DROP COLUMN IF EXISTS owner_id;
ALTER TABLE tasks DROP COLUMN IF EXISTS latest_position;
ALTER TABLE tasks DROP COLUMN IF EXISTS due_date;
ALTER TABLE tasks DROP COLUMN IF EXISTS completed_at;
ALTER TABLE tasks DROP COLUMN IF EXISTS deleted_at;

-- Drop task_dependencies table
DROP TABLE IF EXISTS task_dependencies;

-- Drop functions
DROP FUNCTION IF EXISTS check_circular_dependency();
DROP FUNCTION IF EXISTS update_task_completion();
DROP FUNCTION IF EXISTS add_latest_position(UUID, TEXT, UUID);
DROP FUNCTION IF EXISTS get_task_hierarchy(UUID);
DROP FUNCTION IF EXISTS soft_delete_task(UUID);

-- Drop indexes
DROP INDEX IF EXISTS tasks_progress_percentage_idx;
DROP INDEX IF EXISTS tasks_parent_task_id_idx;
DROP INDEX IF EXISTS tasks_owner_id_idx;
DROP INDEX IF EXISTS tasks_due_date_idx;
DROP INDEX IF EXISTS tasks_completed_at_idx;
DROP INDEX IF EXISTS tasks_deleted_at_idx;
```

## ✅ Success Indicators

After applying the schema, you should see:

1. **New columns** in the tasks table:
   - `progress_percentage`
   - `parent_task_id`
   - `owner_id`
   - `latest_position`
   - `due_date`
   - `completed_at`
   - `deleted_at`

2. **New table**: `task_dependencies`

3. **New functions**:
   - `check_circular_dependency()`
   - `update_task_completion()`
   - `add_latest_position()`
   - `get_task_hierarchy()`
   - `soft_delete_task()`

4. **New indexes** for performance optimization

5. **Updated RLS policies** for security

## 🎯 Next Steps

Once the database schema is applied:

1. **Run the frontend tests**: `npm run test:task-management`
2. **Start the development server**: `npm run dev`
3. **Test the UI**: Navigate to a project and try creating/editing tasks
4. **Verify functionality**: Test all CRUD operations

## 📞 Support

If you encounter any issues:

1. Check the Supabase logs in the dashboard
2. Verify your environment variables are correct
3. Ensure all dependencies are installed
4. Check the browser console for any errors

The schema is designed to be safe and uses `IF NOT EXISTS` clauses to prevent conflicts with existing data.
