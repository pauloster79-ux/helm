# Task Table View - UI Visual Guide

## Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  Project Phoenix - Tasks                   [Cards] [List] [●Table]    [+ Add Task] │
├────────────────────────────────────────────────────────────────────────────────────┤
│  🔍 Search tasks...                                             [🔽 Filters]        │
├───┬─────────────────────────────────────────────────────────────────┬──────────────┤
│   │                                                                 │              │
│   │  TABLE VIEW (70%)                                              │ ASSISTANT    │
│   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ PANE (30%)   │
│   │  [x] TASK              OWNER    START    END      STATUS  %    │              │
│   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ 💡 Project   │
│ [ ] ▼ Phase 1: Discovery   Sarah   Oct 1   Oct 15   [In Progress]  │ Assistant    │
│ [ ]   ▶ Requirements       Sarah   Oct 1   Oct 8    [In Progress]  │              │
│ [ ]   ▶ Architecture       Alex    Oct 9   Oct 15   [To Do]        │ ┌──────────┐ │
│ [ ] ▼ Phase 2: Design      Alex    Oct 16  Nov 15   [To Do]        │ │ Proposal │ │
│ [ ]   ▼ UI/UX Design       Emma    Oct 16  Oct 25   [To Do]        │ │   Card   │ │
│ [ ]     Wireframes         Emma    Oct 16  Oct 18   [To Do]        │ └──────────┘ │
│ [ ]     Mockups            Emma    Oct 21  Oct 23   [To Do]        │              │
│ [ ]   Backend Dev          Alex    Oct 26  Nov 8    [To Do]        │ ┌──────────┐ │
│   │                                                                 │ │ Insight  │ │
│   │  Total: 42 | In Progress: 12 | Completed: 18                   │ │   Card   │ │
│   └─────────────────────────────────────────────────────────────────┘ └──────────┘ │
│                                                                       │  [Got it]  │
└───────────────────────────────────────────────────────────────────────┴──────────────┘
```

## Cell Interaction States

### 1. Task Cell (Title with Hierarchy)

**Display Mode**:
```
▼ Phase 1: Discovery
  ▶ Requirements Gathering
    Subtask Title
```

**Edit Mode**:
```
┌────────────────────────────────────────┐
│ [Edit task title here...]        ✨   │ ← Sparkle if AI has suggestions
└────────────────────────────────────────┘
      ↓ (click sparkle)
┌────────────────────────────────────────┐
│ AI PROPOSAL (high confidence)          │
│ Title is too brief. More descriptive   │
│ titles help with tracking.             │
│                                        │
│ Proposed:                              │
│ "Phase 1: Discovery - Requirements     │
│  and architecture planning"            │
│                                        │
│ [Accept Proposal] [Dismiss]            │
└────────────────────────────────────────┘
```

### 2. Owner Cell

**Display Mode**:
```
[SC] Sarah Chen
```

**Edit Mode**:
```
┌─────────────────────┐
│ Select owner      ▼ │
├─────────────────────┤
│ Unassigned          │
│ Sarah Chen          │
│ Mike Johnson        │
│ Alex Rivera         │
│ Emma Davis          │
└─────────────────────┘
```

### 3. Date Cell (Start/End)

**Display Mode**:
```
Oct 15, 2024
```

**Edit Mode**:
```
┌───────────────────────┐
│ 📅 Oct 15, 2024     ▼ │
├───────────────────────┤
│  October 2024         │
│  Su Mo Tu We Th Fr Sa │
│      1  2  3  4  5  6 │
│   7  8  9 10 11 12 13 │
│  14 [15]16 17 18 19 20│
│  21 22 23 24 25 26 27 │
│  28 29 30 31          │
└───────────────────────┘
```

### 4. Status Cell

**Display Mode**:
```
[In Progress] ← Blue badge, clickable
```

**Edit Mode**:
```
┌────────────────┐
│ In Progress  ▼ │
├────────────────┤
│ To Do          │
│ In Progress ✓  │
│ Review         │
│ Done           │
└────────────────┘
```

### 5. Progress Cell

**Display Mode**:
```
[████████░░] 80%
```

**Edit Mode**:
```
┌────────────────────────────┐
│ Progress: 80%              │
│ ━━━━━●━━━━                 │
│ 0%    50%   100%           │
│                            │
│      [Cancel]  [Save]      │
└────────────────────────────┘
```

### 6. Actions Cell

**Menu**:
```
⋮  ← Click to open
   ↓
┌─────────────────────┐
│ 👁 View Details     │
│ 🕒 Latest Position  │
│ 📋 Duplicate        │
│ ──────────────────  │
│ 🗑 Delete           │
└─────────────────────┘
```

## Assistant Pane States

### Expanded (Default)

```
┌──────────────────────────────────────┐
│ 💡 Project Assistant           [—]   │
├──────────────────────────────────────┤
│ AI Proposals                    🔄   │
│                                      │
│ [⏰ 3 Pending] [✓ 5 Accepted]       │
│                                      │
│ [Status: All ▼] [Confidence: All ▼] │
├──────────────────────────────────────┤
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 📈 IMPROVEMENT                   │ │
│ │ title                            │ │
│ │                                  │ │
│ │ Current: "fix bug"               │ │
│ │ Proposed: "Fix authentication    │ │
│ │           bug in login flow"     │ │
│ │                                  │ │
│ │ Rationale: More specific...      │ │
│ │                                  │ │
│ │ [Apply] [Modify] [Reject] [Later]│ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 💡 INSIGHT                       │ │
│ │                                  │ │
│ │ Your task dependencies form a    │ │
│ │ long chain. Consider finding     │ │
│ │ opportunities to parallelize.    │ │
│ │                                  │ │
│ │           [Got it]               │ │
│ └──────────────────────────────────┘ │
│                                      │
├──────────────────────────────────────┤
│ Need Help?                           │
│ • What makes a good task?            │
│ • How to write criteria?             │
├──────────────────────────────────────┤
│ 💬 Ask about this task...      [→]  │
└──────────────────────────────────────┘
```

### Minimized (Collapsed)

```
┌───┐
│ ▶ │ ← Expand button
├───┤
│   │
│ 💡│ ← Pulses when new items
│ 3 │ ← Badge bounces
│   │
└───┘
```

## Latest Position Panel

```
┌─────────────────────────────────────────────────┐
│ Latest Position: Build Authentication      [✕] │
├─────────────────────────────────────────────────┤
│                                                 │
│  UPDATE                    Oct 11, 2025 2:30 PM│
│  ────────────────────────────────────────────  │
│  Completed OAuth integration with Google.      │
│  Ready for testing.                            │
│                                                 │
│  UPDATE                    Oct 10, 2025 4:15 PM│
│  ────────────────────────────────────────────  │
│  Started work on Google OAuth. Need help       │
│  with redirect URI configuration.              │
│                                                 │
│  UPDATE                    Oct 10, 2025 9:00 AM│
│  ────────────────────────────────────────────  │
│  Beginning authentication implementation.      │
│  Setting up Supabase auth.                     │
│                                                 │
├─────────────────────────────────────────────────┤
│ This is a read-only view.                       │
│ Use "View Details" to add updates.              │
└─────────────────────────────────────────────────┘
```

## Interaction Flows

### Flow 1: Quick Edit Status

```
1. User sees task row:
   [ ] Task Title    Sarah   Oct 1   Oct 15   [To Do]    [░░░] 0%

2. User clicks [To Do] badge

3. Dropdown appears inline:
   ┌────────────────┐
   │ To Do        ✓ │
   │ In Progress    │
   │ Review         │
   │ Done           │
   └────────────────┘

4. User selects "In Progress"

5. Badge updates immediately:
   [ ] Task Title    Sarah   Oct 1   Oct 15   [In Progress]   [░░░] 0%

6. Database updated in background
```

### Flow 2: Edit Title with AI

```
1. User clicks task title: "fix bug"

2. Title becomes editable:
   [fix bug_____________]

3. User types: "fix auth bug"

4. After 1 second, AI analyzes...
   [fix auth bug_______ ✨] ← Sparkle appears

5. User clicks sparkle ✨

6. Popover shows:
   ┌─────────────────────────────────────┐
   │ AI PROPOSAL (high confidence)       │
   │                                     │
   │ Title is vague. Suggested:          │
   │ "Fix authentication bug in          │
   │  login flow endpoint"               │
   │                                     │
   │ [Accept Proposal] [Dismiss]         │
   └─────────────────────────────────────┘

7. User clicks Accept → Title updates

8. User presses Enter → Saves to database
```

### Flow 3: Assistant Pane Filtering

```
State: Showing all project proposals
┌────────────────────┐
│ Proposal for Task A│
│ Proposal for Task B│
│ Proposal for Task C│
└────────────────────┘

User clicks to edit Task B title
         ↓
Pane filters automatically
┌────────────────────┐
│ Proposal for Task B│ ← Only shows Task B
└────────────────────┘

User finishes editing (Enter or clicks away)
         ↓
Pane returns to all
┌────────────────────┐
│ Proposal for Task A│
│ Proposal for Task B│
│ Proposal for Task C│
└────────────────────┘
```

---

## Color Coding

### Status Badges
- 🔵 **To Do**: Gray background, gray text
- 🔵 **In Progress**: Blue background, blue text
- 🟡 **Review**: Yellow background, yellow text
- 🟢 **Done**: Green background, green text

### Progress Bars
- Uses shadcn Progress component
- Fills from left to right
- Percentage shown on right

### Activity Types in Assistant Pane
- 📈 **Improvement**: Blue icon
- 💡 **Missing Info**: Yellow icon
- ⚠️ **Conflict**: Red icon
- 💡 **Insight**: Purple icon (special)

### Action Buttons
- ✅ **Apply/Accept**: Green (proposals)
- 💜 **Got it**: Purple (insights)
- ❌ **Reject**: Red
- ⏰ **Defer**: Gray

---

## Responsive Behavior

### Desktop (1200px+)
- Table: 70% width
- AssistantPane: 30% width (min 400px)
- All columns visible
- Full feature set

### Tablet (768px - 1200px)
- Recommend using Cards or List view
- Table works but may need horizontal scroll
- AssistantPane takes fixed 400px

### Mobile (<768px)
- Table view not recommended (too many columns)
- Use Cards view instead
- AssistantPane would cover full screen if opened

---

## Keyboard Shortcuts

### In Edit Mode
- **Enter**: Save and exit edit mode
- **Escape**: Cancel and revert changes
- **Tab**: (Future) Move to next cell

### General
- **Ctrl+K**: (Future) Quick search
- **Ctrl+F**: (Future) Advanced filters

---

This guide provides visual reference for the Task Table implementation. Use alongside the Quick Start Guide for best results.

