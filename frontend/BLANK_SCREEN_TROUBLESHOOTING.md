# 🐛 Blank Screen Troubleshooting Guide

## Problem
When you select a project and navigate to tasks, you get a blank screen instead of the task list.

## Quick Fixes

### 1. **Check the Debug Panel**
The app now includes a debug panel that will show you exactly what's wrong:

1. **Refresh the page** (Ctrl+F5 or Cmd+Shift+R)
2. **Navigate to a project's Tasks view**
3. **Look for the debug panel** at the top - it will show:
   - ✅ Connection status
   - ✅ Database query results
   - ❌ Any errors

### 2. **Most Common Issue: Database Schema**

**If you see "column does not exist" errors:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run this basic schema check:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'tasks' 
   ORDER BY ordinal_position;
   ```

**Expected columns:**
- `id`, `project_id`, `user_id`, `title`, `description`, `status`, `priority`, `estimated_hours`, `created_at`, `updated_at`

**If missing columns:**
1. Apply the basic schema from `docs/architecture/DATABASE_SCHEMA.sql`
2. Or apply the enhanced schema from `docs/architecture/PHASE_2B_TASK_SCHEMA_UPDATE.sql`

### 3. **Check Browser Console**
1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Look for red error messages**
4. **Common errors:**
   - `Failed to fetch tasks: column "progress_percentage" does not exist`
   - `Failed to fetch tasks: column "parent_task_id" does not exist`
   - Network errors
   - Authentication errors

### 4. **Check Network Tab**
1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Refresh the page**
4. **Look for failed requests** (red entries)
5. **Click on failed requests** to see error details

### 5. **Authentication Issues**
If you see authentication errors:
1. **Sign out** and **sign back in**
2. **Check your Supabase project settings**
3. **Verify environment variables** in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Step-by-Step Debugging

### Step 1: Check Debug Panel
- Look at the debug information displayed on the tasks page
- Note which tests pass/fail
- This tells you exactly what's wrong

### Step 2: Database Connection
If basic query fails:
- Check your Supabase URL and key
- Verify your project is active
- Check if you have internet connection

### Step 3: Schema Issues
If enhanced query fails but basic query works:
- Your database is missing the new columns
- Apply the schema update script
- Or use the basic version (already implemented)

### Step 4: JavaScript Errors
If queries work but screen is blank:
- Check browser console for JavaScript errors
- Look for React component errors
- Check for missing imports or dependencies

## Common Solutions

### Solution 1: Use Basic Schema (Recommended for MVP)
The app now automatically falls back to basic schema if enhanced features aren't available.

**What this means:**
- ✅ Task creation works
- ✅ Task listing works
- ✅ Basic task management works
- ❌ Advanced features (progress tracking, subtasks, etc.) not available

### Solution 2: Apply Enhanced Schema
To get full functionality:

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Copy contents of `docs/architecture/PHASE_2B_TASK_SCHEMA_UPDATE.sql`**
4. **Paste and run the script**
5. **Refresh your app**

### Solution 3: Reset to Working State
If nothing works:

1. **Check out a working commit:**
   ```bash
   git log --oneline
   git checkout <working-commit-hash>
   ```

2. **Or apply basic schema only:**
   ```sql
   -- Run this in Supabase SQL Editor
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'tasks';
   ```

## Expected Behavior After Fix

### Working State:
- ✅ Tasks page loads in <500ms
- ✅ Task list displays with title, status, priority
- ✅ "Add Task" button works
- ✅ Task cards/rows are clickable
- ✅ Debug panel shows all green checkmarks

### Still Broken:
- ❌ Blank screen persists
- ❌ Debug panel shows errors
- ❌ Browser console shows errors

## Getting Help

### If Still Stuck:
1. **Copy the debug panel output**
2. **Copy browser console errors**
3. **Check Network tab for failed requests**
4. **Share the specific error messages**

### Useful Information to Share:
- Debug panel results
- Browser console errors
- Network request failures
- Supabase project URL (without the key)
- Which step fails

## Prevention

### To Avoid This in the Future:
1. **Always test database changes** in a development environment first
2. **Keep backups** of working database schemas
3. **Use feature flags** for new database columns
4. **Test with basic schema** before applying enhancements

## Quick Commands

### Check Database Schema:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;
```

### Check Task Count:
```sql
SELECT COUNT(*) as task_count 
FROM tasks 
WHERE user_id = auth.uid();
```

### Test Basic Query:
```sql
SELECT id, title, status, priority
FROM tasks 
WHERE user_id = auth.uid()
LIMIT 5;
```

---

**Remember:** The debug panel will tell you exactly what's wrong! Look for it at the top of the tasks page. 🐛
