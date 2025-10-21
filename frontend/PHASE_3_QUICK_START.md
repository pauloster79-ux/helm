# Phase 3 - Quick Start Guide

## ✅ What's Been Done For You

1. ✅ Dependencies installed (`@radix-ui/react-switch` and `@radix-ui/react-tabs`)
2. ✅ Test page created at `/ai-test`
3. ✅ Route added to App.tsx
4. ✅ All components ready to use

## 🚀 See It Working NOW (3 Steps)

### Step 1: Start the Dev Server

```bash
npm run dev
```

### Step 2: Navigate to the Test Page

Open your browser and go to:
```
http://localhost:5173/ai-test
```

(You'll need to log in first if you haven't already)

### Step 3: Test the AI Features

On the test page:

1. **Type something vague** in the "Task Title" field
   - Example: "fix bug"
   - Wait 1 second
   - See AI suggestions appear below!

2. **Click "Apply Suggestion"**
   - Watch the field update automatically

3. **Try the Description field**
   - Type a short description (< 50 chars)
   - See "missing information" suggestions

4. **Check the Right Pane (Assistant Pane)**
   - See all proposals in the queue
   - Click "Settings" tab
   - Configure AI behavior
   - Adjust cost limits
   - Toggle features

5. **Test the Collapsible Pane**
   - Click the `◀` button to collapse
   - See the badge with pending count
   - Click again to expand

## 🎯 What You'll See

**The AI Assistant is FULLY FUNCTIONAL with mock data!**

- ✅ Real-time suggestions (debounced 1000ms)
- ✅ Inline display with confidence indicators
- ✅ Apply/Dismiss actions
- ✅ Proposal queue with filters
- ✅ Settings panel
- ✅ Chat input (UI only)
- ✅ 70/30 split layout
- ✅ Collapsible assistant pane

**All of this works WITHOUT any backend!**

## 📋 Database Setup (Optional - For Real Data)

When you're ready to store real proposals:

1. Open your Supabase SQL Editor
2. Copy and run: `docs/architecture/PHASE_3_DATABASE_MIGRATION.sql`
3. Optionally run: `docs/architecture/PHASE_3_SEED_DATA.sql`
   - Update placeholder IDs first!
   - This adds example proposals you can see in the UI

## 🔌 Connect Real AI (Next Step)

The test page uses mock data. To connect real AI:

### Option A: Supabase Edge Function (Recommended)

```bash
# Create the function
supabase functions new ai-validate

# Deploy it
supabase functions deploy ai-validate --no-verify-jwt
```

Then update `frontend/src/hooks/useAIValidation.ts`:
```typescript
// Replace the mock response section with:
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-validate`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  }
)
```

### Option B: FastAPI Service

Follow the spec in `phase3-complete.md` to create a full Python AI service.

## 🎨 Integrate into Your App

Once you've tested it, add the AssistantPane to any form:

```typescript
import { AssistantPane } from '@/components/ai/AssistantPane';
import { useAIValidation } from '@/hooks/useAIValidation';
import { InlineSuggestion } from '@/components/ai/InlineSuggestion';

function MyForm() {
  const { isAnalyzing, suggestions, validate } = useAIValidation({
    projectId: 'your-project-id',
    componentType: 'task',
    enabled: true
  });

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-8">
        {/* Your form here */}
        <input
          onChange={(e) => validate('title', e.target.value)}
        />
        <InlineSuggestion
          proposals={suggestions}
          issues={[]}
          isAnalyzing={isAnalyzing}
          onApply={(p) => setTitle(p.proposed_value)}
          onDismiss={() => {}}
        />
      </div>
      
      {/* AI Assistant Pane */}
      <AssistantPane projectId="your-project-id" />
    </div>
  );
}
```

## 🐛 Troubleshooting

**"Module not found" errors?**
```bash
npm install
```

**Can't see the page?**
- Make sure you're logged in
- Navigate to: `http://localhost:5173/ai-test`

**No suggestions appearing?**
- Type at least 3 characters
- Wait 1 second (debounce delay)
- Try "fix bug" or "update"

**Pane not showing?**
- Check browser console for errors
- Make sure you're on the `/ai-test` route

## 📚 Next Steps

1. ✅ Test the UI (you can do this now!)
2. Run database migrations (optional)
3. Create Edge Function or FastAPI service
4. Connect real AI (OpenAI/Anthropic)
5. Integrate into your task forms
6. Enjoy AI-powered project management! 🎉

---

**Everything is ready to test!** Just run `npm run dev` and go to `/ai-test`


