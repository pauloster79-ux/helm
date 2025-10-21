# Task Table View - Setup Instructions

## Database Migration Required

Before using the new Table view, you need to apply the database migration to add `start_date` and `end_date` fields to the tasks table.

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to SQL Editor

2. **Run Migration**
   - Copy the contents of `docs/architecture/ADD_START_END_DATES.sql`
   - Paste into the SQL Editor
   - Click "Run"

3. **Verify Migration**
   - Check that the migration completed successfully
   - The tasks table should now have `start_date` and `end_date` columns

### What This Adds

- `start_date` (DATE, nullable) - Planned start date for the task
- `end_date` (DATE, nullable) - Planned end date for the task (replaces the concept of due_date)
- Indexes on both date fields for performance
- Check constraint to ensure end_date >= start_date

## Using the Table View

Once the migration is complete:

1. Go to any project
2. Click on "Tasks" tab
3. You'll see three view options: **Cards**, **List**, **Table**
4. Click **Table** to see the new advanced table view

## Features

- **Hierarchical Display**: Tasks with subtasks show expand/collapse buttons
- **Inline Editing**: Click any cell to edit (title, owner, dates, status, progress)
- **AI Suggestions**: When editing title, AI provides inline suggestions
- **Sorting**: Click column headers to sort
- **Search**: Use the search box to filter tasks
- **Assistant Pane**: Shows AI proposals for the task being edited (minimizable)

## Troubleshooting

### Error: "column does not exist"
- Make sure you've run the migration SQL script
- Refresh the page after running the migration

### Table not showing
- Check browser console for errors
- Make sure all dependencies are installed: `npm install` in frontend directory

### AI suggestions not appearing
- Check that the AI service is running (FastAPI service)
- AI suggestions are currently in "mock mode" if service is unavailable

