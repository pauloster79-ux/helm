# Task Table View - Quick Start Guide

## 🚀 Getting Started

### Step 1: Apply Database Migration

**Before using the table view**, you need to add the `start_date` and `end_date` columns to your database.

1. Open **Supabase Dashboard** → Your Project
2. Go to **SQL Editor**
3. Click **"New query"**
4. Copy the contents of `docs/architecture/ADD_START_END_DATES.sql`
5. Paste into the SQL editor
6. Click **"Run"** or press Ctrl+Enter

✅ **Confirmation:** You should see "Success. No rows returned"

---

### Step 2: Access the Table View

1. Navigate to any project in your Helm app
2. Click on the **"Tasks"** tab
3. Look for the view mode toggle: **Cards | List | Table**
4. Click **"Table"**

🎯 **You should now see the advanced table view!**

---

## 📖 Using the Table View

### Inline Editing

Click on any cell to edit it inline:

| Column | How to Edit |
|--------|------------|
| **Task Title** | Click → type → Enter to save |
| **Owner** | Click → select from dropdown |
| **Start Date** | Click → pick from calendar |
| **End Date** | Click → pick from calendar |
| **Status** | Click → select from dropdown |
| **Progress** | Click → adjust slider (0-100%) |

**💡 Tip:** Press **Escape** to cancel editing without saving.

---

### AI-Powered Suggestions

When editing a task title, watch for the **sparkle icon** (✨):

1. **Type** your task title
2. **Wait** for AI analysis (sparkle icon appears)
3. **Click** the sparkle icon
4. **Review** AI suggestions in the popover
5. **Apply** or **Dismiss** suggestions

**Example suggestions:**
- "Make this more specific"
- "This task is too broad - consider breaking it down"
- "Add acceptance criteria"

---

### Task Hierarchy

**Expand/Collapse Parent Tasks:**

- **▶** = Collapsed (click to expand)
- **▼** = Expanded (click to collapse)

**Visual Hierarchy:**
```
□ ▼ Parent Task
□     Child Task (indented)
□     Another Child (indented)
```

**To create subtasks:**
1. Click the **⋮** menu on a row
2. Select **"View Details"**
3. In the modal, select a **"Parent Task"**
4. Click **"Save"**

---

### Sorting

Click any **column header** to sort:

- **First click:** Sort ascending (↑)
- **Second click:** Sort descending (↓)
- **Third click:** Remove sort

**Sortable columns:**
- Task (alphabetical)
- Owner (by name)
- Start Date (chronological)
- End Date (chronological)
- Status (custom order: todo → in_progress → review → done)
- Progress (numerical)

---

### Searching

Use the **search box** in the toolbar:

- Searches **task titles** and **descriptions**
- Updates results in real-time
- Case-insensitive

**Example searches:**
- "design" → finds all tasks with "design" in title or description
- "homepage" → finds homepage-related tasks

---

### Actions Menu (⋮)

Click the **three dots** on any row to access:

| Action | Description |
|--------|------------|
| **View Details** | Opens full task editor modal |
| **Latest Position** | Shows read-only history panel |
| **Duplicate** | (Coming soon) |
| **Delete** | Permanently deletes the task |

---

### AI Assistant Pane

The **AI Assistant Pane** appears on the right side:

**When NOT editing:**
- Shows all proposals and insights for the project

**When editing a task:**
- **Filters** to show only proposals for that task
- Shows **real-time suggestions** based on your changes

**Proposals vs. Insights:**

| Type | Badge | Actions | Purpose |
|------|-------|---------|---------|
| **Proposal** | Blue | Apply, Modify, Reject, Defer | AI suggests a change |
| **Insight** | Purple | Got it | AI provides information |

**Minimize/Maximize:**
- Click the **panel icon** to minimize
- When minimized, shows **notification badge** for new items
- Click again to maximize

---

### Latest Position Panel

View the **history of significant updates** for a task:

1. Click **⋮** on any row
2. Select **"Latest Position"**
3. Side panel opens showing:
   - Past updates
   - AI insights
   - Significant changes

**Note:** This is **read-only** in MVP. To add new entries, use the full task detail modal.

---

## 🎨 Visual Guide

### Table Layout

```
┌─────────────────────────────────────────────────────────────────┬──────────────┐
│ [Search...] [Filter]                            Total: 25       │ AI Assistant │
├─────────────────────────────────────────────────────────────────┤    Pane      │
│ □ Task              Owner   Start    End    Status   Progress ⋮│              │
│ □ ▼ Parent Task    John    Oct 15   Oct 20 In Prog. ████░ 80%│ 📋 Proposals │
│ □   Child Task     Mary    Oct 16   Oct 18 Todo     ░░░░░  0%│              │
│ □ Another Task     —       Oct 17   Oct 25 Review   ████░ 75%│ 💡 Insights  │
│                                                                 │              │
│                                                                 │ [Minimize]   │
├─────────────────────────────────────────────────────────────────┴──────────────┤
│ Total: 25  In Progress: 8  Completed: 12                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⌨️ Keyboard Shortcuts (Coming Soon)

Currently, basic keyboard shortcuts work:
- **Enter** - Save cell edit
- **Escape** - Cancel cell edit
- **Tab** - Move to next cell (browser default)

---

## 🔧 Troubleshooting

### Problem: "Table button not showing"

**Solution:**
1. Hard refresh: **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac)
2. Check browser console (F12) for errors
3. Ensure dev server is running: `cd frontend && npm run dev`

---

### Problem: "Dates not saving"

**Solution:**
1. ✅ **Did you apply the database migration?** (See Step 1)
2. Check Supabase dashboard → Table Editor → tasks table
3. Verify `start_date` and `end_date` columns exist

---

### Problem: "AI suggestions not appearing"

**Solution:**
1. Verify AI service is configured in **Settings → AI Assistant**
2. Check API key is valid
3. Try editing a task title and wait 2-3 seconds

---

### Problem: "Table is empty"

**Solution:**
1. ✅ **Create some tasks first** using "+ Add Task" button
2. Check if you're viewing the correct project
3. Try clearing the search filter

---

## 🎯 Best Practices

### Task Organization

1. **Use parent tasks** for epics or major features
2. **Indent subtasks** under parent tasks
3. **Set realistic dates** (AI will warn you if they're unrealistic)
4. **Update progress** regularly (helps AI give better insights)

### Inline Editing Tips

1. **Edit one cell at a time** for best AI suggestions
2. **Be specific** in task titles for better AI analysis
3. **Save frequently** (Enter key) to avoid losing changes
4. **Use the full modal** (View Details) for complex edits

### Performance Tips

1. **Collapse parent tasks** you're not actively working on
2. **Use search/filters** to focus on relevant tasks
3. **The table handles 100+ tasks smoothly** via virtual scrolling

---

## 📊 Stats Bar

At the bottom of the table, you'll see:

- **Total:** Count of all tasks
- **In Progress:** Tasks currently being worked on
- **Completed:** Tasks marked as "done"

---

## 🎉 You're Ready!

You now know how to:
- ✅ Apply the database migration
- ✅ Access the table view
- ✅ Edit tasks inline
- ✅ Use AI suggestions
- ✅ Manage task hierarchy
- ✅ Sort and search
- ✅ Use the AI Assistant Pane

**Happy task management!** 🚀

---

## 📚 More Resources

- **Implementation Status:** `ADVANCED_TABLE_IMPLEMENTATION_STATUS.md`
- **Full Plan:** `advanced-task-table-mvp.plan.md`
- **Database Migration:** `docs/architecture/ADD_START_END_DATES.sql`

---

**Questions or Issues?** Check the browser console (F12) for detailed error messages.

