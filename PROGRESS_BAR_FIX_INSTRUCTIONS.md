# Fix Progress Bar - Step by Step Instructions

## The Problem
The progress bar is not working because the `progress_percentage` field doesn't exist in your Supabase database.

## The Solution
You need to apply a database migration to add this field.

---

## 🔧 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your account
3. Select your Helm project

### Step 2: Open SQL Editor
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### Step 3: Copy and Run the SQL Script
1. Open the file: `docs/architecture/FIX_PROGRESS_BAR.sql`
2. Copy ALL the contents
3. Paste into the SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)

### Step 4: Verify the Update
You should see output showing:
- `total_tasks`: Number of tasks in your database
- `avg_progress`: Average progress percentage
- `min_progress`: Should be 0
- `max_progress`: Should be 100

### Step 5: Refresh Your App
1. Go back to your Helm application
2. Refresh the page (F5 or Ctrl+R)
3. Open a task detail modal
4. You should now see the progress bar working!

---

## 🎯 What This Script Does

1. **Adds the `progress_percentage` column** to the tasks table
   - Type: INTEGER (whole numbers 0-100)
   - Default: 0 (0% complete)
   - Constraint: Must be between 0 and 100

2. **Creates an index** for better performance when filtering by progress

3. **Sets initial values** for existing tasks based on their status:
   - `todo` → 0%
   - `in_progress` → 50%
   - `review` → 75%
   - `done` → 100%

4. **Verifies** the update was successful

---

## 🐛 If You See Errors

### Error: "column already exists"
✅ This is fine! It means the column was already added. The script uses `IF NOT EXISTS` to prevent errors.

### Error: "permission denied"
❌ Make sure you're using your Supabase project (not a read-only view)
❌ You might need to use the Supabase service role key

### Error: "relation tasks does not exist"
❌ You need to run the base schema first: `docs/architecture/DATABASE_SCHEMA.sql`

---

## 📊 After Applying the Fix

Once the database is updated, you'll be able to:
- ✅ See progress bars with the correct blue color
- ✅ Update task progress percentages
- ✅ Filter tasks by progress percentage
- ✅ Sort tasks by progress
- ✅ See accurate progress indicators in all views

---

## 🧹 Cleanup (Optional)

After confirming the progress bar works, you can remove the debug info I added:

1. Open `frontend/src/components/tasks/TaskDetailModal.tsx`
2. Find and remove the debug line (around line 283-285):
   ```tsx
   {/* Debug info */}
   <div className="text-xs text-gray-500 mt-1">
     Debug: taskDetails={JSON.stringify(taskDetails?.progress_percentage)}, task={JSON.stringify(task.progress_percentage)}
   </div>
   ```

3. Open `frontend/src/components/tasks/TaskCard.tsx`
4. Find line 125 and change:
   ```tsx
   <span>Progress: {task.progress_percentage}% (type: {typeof task.progress_percentage})</span>
   ```
   To:
   ```tsx
   <span>Progress: {task.progress_percentage}%</span>
   ```

---

## ℹ️ Additional Information

### Want More Task Features?
The full Phase 2B schema update includes:
- Task dependencies
- Subtasks (parent-child relationships)
- Task owners/assignments
- Due dates and completion tracking
- Latest position updates
- Soft delete functionality

To get all these features, run the complete schema:
`docs/architecture/PHASE_2B_TASK_SCHEMA_UPDATE.sql`

---

## 📞 Still Having Issues?

If the progress bar still doesn't work after applying the fix:
1. Check the browser console for errors (F12 → Console tab)
2. Verify the database update was successful (check Supabase Table Editor)
3. Make sure you refreshed the page
4. Check if there are any RLS (Row Level Security) policy issues

---

**Need Help?** Let me know what error you're seeing!




