# Task Editing Fixes - Complete Guide

## Issues Fixed

### 1. Missing Database Columns
**Problem:** The UI was trying to update `start_date` and `end_date` columns that didn't exist in the database.

**Solution:** Added the missing columns to the tasks table schema.

### 2. Validation Error on Partial Updates
**Problem:** When updating only the status or dates, the validation was requiring a title, causing failures.

**Solution:** Modified the validation logic to only require title when explicitly updating the title field.

### 3. Missing Additional Columns
**Bonus:** Also added other missing columns that the UI expects:
- `progress_percentage` - Task completion percentage
- `owner_id` - Task assignment
- `parent_task_id` - For subtasks
- `deleted_at` - For soft deletes
- Updated status constraint to include 'review' status

---

## How to Apply the Fixes

### Step 1: Apply Database Migration

You need to run the SQL migration to add the missing columns to your Supabase database.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `docs/architecture/MIGRATION_ADD_TASK_DATES.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Ctrl+Enter)

#### Option B: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push --db-url "your-supabase-connection-string"
```

### Step 2: Verify the Migration

After running the migration, verify the columns were added:

```sql
-- Run this in the SQL Editor to check the tasks table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tasks'
ORDER BY ordinal_position;
```

You should see these new columns:
- `progress_percentage`
- `start_date`
- `end_date`
- `owner_id`
- `parent_task_id`
- `deleted_at`

### Step 3: Update TypeScript Types (Optional)

If you're using Supabase CLI to generate types:

```bash
cd frontend
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

### Step 4: Test the Fixes

1. **Start your development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Task Editing:**
   - Open your application in the browser
   - Navigate to a project with tasks
   - Try editing task status (should work without errors)
   - Try editing task dates (should work without errors)
   - Try editing task progress (should work without errors)

3. **Check the Console:**
   - Open browser DevTools (F12)
   - Check the Console tab
   - You should see NO errors when editing tasks

---

## What Was Changed

### 1. Frontend Code Changes

**File:** `frontend/src/hooks/useTasks.ts`

**Change:** Modified the `updateTask` function to only validate title when explicitly updating it.

**Before:**
```typescript
// Validate updates if they include form data
if (updates.title !== undefined || updates.description !== undefined || updates.status !== undefined) {
  const validation = validateTaskData({
    title: updates.title || '',
    description: updates.description || '',
    status: updates.status || 'todo',
    priority: updates.priority || 'medium'
  })
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0]
    throw new Error(firstError)
  }
}
```

**After:**
```typescript
// Only validate if we're updating title (since title is required)
// For other fields, skip validation to allow partial updates
if (updates.title !== undefined) {
  if (!updates.title.trim()) {
    throw new Error('Task title is required')
  }
  if (updates.title.length < 3) {
    throw new Error('Task title must be at least 3 characters')
  }
  if (updates.title.length > 200) {
    throw new Error('Task title must be 200 characters or less')
  }
}
```

### 2. Database Schema Changes

**Files:**
- `docs/architecture/DATABASE_SCHEMA.sql` (updated)
- `docs/architecture/MIGRATION_ADD_TASK_DATES.sql` (new)

**Changes:**
- Added `progress_percentage` column (INTEGER, 0-100)
- Added `start_date` column (TIMESTAMP WITH TIME ZONE)
- Added `end_date` column (TIMESTAMP WITH TIME ZONE)
- Added `owner_id` column (UUID, references profiles)
- Added `parent_task_id` column (UUID, references tasks for subtasks)
- Added `deleted_at` column (TIMESTAMP WITH TIME ZONE for soft deletes)
- Updated status constraint to include 'review' status
- Added indexes for new columns
- Updated RLS policies to include owner_id

---

## Troubleshooting

### Issue: "Column does not exist" error persists

**Solution:** Make sure you ran the migration SQL script. Check the Supabase dashboard to verify the columns exist.

### Issue: Still getting validation errors

**Solution:** 
1. Clear your browser cache
2. Restart your dev server
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: TypeScript errors about missing properties

**Solution:** Regenerate your TypeScript types from Supabase:
```bash
cd frontend
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

### Issue: RLS policy errors

**Solution:** The migration includes updated RLS policies. If you get permission errors, make sure the policies were applied correctly. Check in Supabase Dashboard > Authentication > Policies.

---

## Testing Checklist

- [ ] Applied database migration
- [ ] Verified columns exist in database
- [ ] No console errors when editing task status
- [ ] No console errors when editing task dates
- [ ] No console errors when editing task progress
- [ ] Task updates persist after page refresh
- [ ] All task fields display correctly

---

## Summary

These fixes resolve the task editing errors by:
1. Adding the missing database columns that the UI expects
2. Fixing the validation logic to allow partial updates
3. Ensuring all task-related features work correctly

The application should now work without errors when editing tasks!


