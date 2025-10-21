# Task Table View - Quick Start Guide

## 🚀 Getting Started

### Step 1: Apply Database Migration

The table view requires new date fields in the database.

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `docs/architecture/ADD_START_END_DATES.sql`
4. Click **Run**
5. Verify success message

### Step 2: View the Table

1. Open the app in your browser (usually `http://localhost:5173`)
2. Navigate to any project
3. Click on the **Tasks** tab
4. You'll see three view options at the top:
   - **Cards** - Grid layout
   - **List** - Simple table
   - **Table** ← Click this!

### Step 3: Try the Features

#### Inline Editing
- **Click any cell** to edit it
- **Title cell**: AI will analyze and suggest improvements
  - Look for the sparkle icon ✨
  - Click it to see suggestions
- **Owner cell**: Select from dropdown
- **Date cells**: Pick from calendar
- **Status**: Choose from dropdown
- **Progress**: Drag the slider

#### Hierarchy
- **Parent tasks** have a chevron icon (▶)
- **Click chevron** to expand and see subtasks
- **Subtasks** are indented

#### Search & Sort
- **Search box** at top filters by title or description
- **Click column headers** to sort
- Click again to reverse sort

#### Actions Menu
- **Three dots (⋮)** at the end of each row
- **View Details**: Opens full task modal
- **Latest Position**: See update history
- **Delete**: Remove the task

#### Assistant Pane
- **Right side**: Shows AI proposals
- **Minimize button**: Collapse to save space
- **Editing a task**: Pane shows proposals for that task only
- **Insights**: Purple "Got it" button
- **Proposals**: Green "Apply" button + Modify/Reject/Defer

## 🎯 What to Look For

### AI Suggestions in Action

1. Click a task title to edit
2. Type something brief like "fix bug"
3. Wait 1 second
4. **Sparkle icon ✨** appears
5. Click it → AI suggests more descriptive title
6. Click **Accept** to apply

### Assistant Pane Behavior

**When NOT editing**:
- Shows all pending proposals for the project
- Can have insights, questions, suggestions

**When editing a cell**:
- Automatically filters to show only proposals for that specific task
- Helps you focus on relevant suggestions

**When minimized**:
- Collapses to thin bar on right
- If new proposals arrive → icon pulses and badge bounces
- Click to expand again

## 🐛 Troubleshooting

### "Column 'start_date' does not exist"
→ You haven't run the migration yet. See Step 1 above.

### Table view is blank
→ Check browser console (F12) for errors.

### AI suggestions not showing
→ That's okay! The AI service might not be running. The table still works without it.

### AssistantPane not visible
→ It might be minimized. Look for a thin bar on the right side with a button.

### Can't edit dates
→ Make sure migration was applied. Try refreshing the page.

## 💡 Tips

- **Use keyboard shortcuts**: Enter to save, Escape to cancel
- **Search is fast**: Type to filter instantly
- **AssistantPane follows you**: It shows relevant proposals as you edit
- **Insights vs Proposals**: 
  - Insights = FYI information (purple "Got it")
  - Proposals = Suggested changes (green "Apply")

## 📋 Known Limitations (MVP)

- Owner shows "Assigned/Unassigned" (no real team member names yet)
- No dependencies column (coming soon)
- No drag-and-drop (use View Details to change parent task)
- No bulk operations (checkboxes work but no actions yet)
- No duration calculation (needs both start and end dates)

## ✅ Success Criteria

You know it's working when:
1. You can see the Table view option
2. Tasks display in hierarchical format
3. You can expand/collapse parent tasks
4. Clicking a cell lets you edit it
5. Changes save to the database
6. AI suggestions appear when editing title
7. AssistantPane shows on the right
8. Latest Position can be viewed

---

**Need help?** Check `TASK_TABLE_IMPLEMENTATION_SUMMARY.md` for technical details.

