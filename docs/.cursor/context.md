# Cursor AI Context - Quick Reference

**For Cursor AI**: This file provides quick context about the Helm project.

---

## 🎯 What We're Building

**Helm** = AI-powered project management where AI proposes and humans approve.

**Current Phase**: Phase 1 of 5 (Foundation & Authentication)

---

## 📁 Project Structure

```
helm/
├── docs/
│   ├── mvp/              ← CURRENT IMPLEMENTATION (check here first!)
│   ├── vision/           ← Full platform vision (context only)
│   ├── architecture/     ← Technical decisions
│   └── dev/              ← Development guides
│
├── frontend/             ← React + TypeScript + Tailwind
│   └── src/
│       ├── pages/        ← Full page components
│       ├── components/   ← Reusable UI components
│       ├── contexts/     ← React context (auth, etc.)
│       ├── lib/          ← Utilities & Supabase client
│       └── hooks/        ← Custom React hooks
│
└── backend/              ← (Phase 3+, not needed yet)
```

---

## 🏗️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router v6 (routing)
- React Query (server state)
- Supabase client (database)

**Backend:**
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- NestJS (Phase 3+, not used yet)
- FastAPI + Python (Phase 3+, AI service, not used yet)

---

## 📋 Current Phase Checklist

**Phase 1: Foundation & Authentication**

Status: See `/docs/mvp/CURRENT_PHASE.md` for detailed checklist.

Quick status:
- [ ] Supabase project setup
- [ ] Database schema initialized
- [ ] OAuth providers configured
- [ ] Frontend auth working
- [ ] Protected routes implemented
- [ ] Basic dashboard showing

---

## 🎨 Code Style

**TypeScript:**
```typescript
// Use function components
export function ComponentName({ prop }: Props) {
  const [state, setState] = useState<Type>(initial)
  
  return <div>...</div>
}

// Use explicit types
interface Props {
  id: string
  optional?: number
}

// Prefer const over let
const value = getData()
```

**React:**
- Functional components only (no classes)
- Hooks for state and effects
- Props destructured in parameters
- TypeScript for all component props

**Styling:**
- Tailwind utility classes
- No custom CSS unless necessary
- Responsive by default (mobile-first)

**File naming:**
- Components: `PascalCase.tsx` (e.g., `LoginPage.tsx`)
- Utilities: `camelCase.ts` (e.g., `authHelpers.ts`)
- Types: `camelCase.ts` (e.g., `types.ts`)

---

## 🔑 Important Patterns

**Supabase Auth:**
```typescript
// Get current user
const { user } = useAuth()

// Sign in with OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin }
})

// Sign out
await supabase.auth.signOut()
```

**Supabase Queries:**
```typescript
// Select with relations
const { data, error } = await supabase
  .from('tasks')
  .select('*, owner:owner_id(*)')
  .eq('project_id', projectId)

// Insert
const { data, error } = await supabase
  .from('tasks')
  .insert({ title, description, project_id })
  .select()
  .single()

// Update
const { error } = await supabase
  .from('tasks')
  .update({ status: 'done' })
  .eq('id', taskId)
```

**Protected Routes:**
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 📖 Documentation Quick Links

**For current implementation:**
- `/docs/mvp/CURRENT_PHASE.md` - What to build now
- `/docs/mvp/PHASE_1_GUIDE.md` - Step-by-step implementation
- `/docs/mvp/MVP_SCOPE.md` - All 5 MVP phases

**For context:**
- `/docs/vision/functional-spec.md` - Complete platform design
- `/docs/architecture/TECH_DECISIONS.md` - Why we chose X over Y

**For setup:**
- `/docs/dev/setup.md` - Development environment setup
- `.cursorrules` - Cursor configuration

---

## 🚫 What NOT to Build Yet

**Phase 1 MVP** does NOT include:
- ❌ No task creation yet (Phase 2)
- ❌ No AI validation yet (Phase 3)
- ❌ No backend API yet (Phase 3)
- ❌ No proposals yet (Phase 3)
- ❌ No real-time updates (Phase 4)
- ❌ No Slack integration (post-MVP)

**Only auth and basic UI shell in Phase 1!**

---

## 💡 When Generating Code

**Always:**
- ✅ Include TypeScript types
- ✅ Handle loading and error states
- ✅ Add proper error messages
- ✅ Use Tailwind for styling
- ✅ Make it responsive (mobile-first)
- ✅ Follow existing patterns in codebase

**Never:**
- ❌ Use `any` type (use proper types or `unknown`)
- ❌ Leave console.logs in production code
- ❌ Ignore error handling
- ❌ Use `var` (use `const` or `let`)
- ❌ Add features not in current phase

---

## 🔍 Debug Hints

**If auth not working:**
- Check Supabase credentials in `.env.local`
- Verify OAuth redirect URIs match
- Check browser console for Supabase errors
- Look at Supabase Dashboard → Auth → Logs

**If database queries failing:**
- Check Row-Level Security policies in Supabase
- Verify user is authenticated (`user` exists)
- Check table permissions in Supabase Dashboard

**If components not rendering:**
- Check React Developer Tools
- Verify imports are correct
- Check for TypeScript errors in terminal
- Look for console errors in browser

---

## 📊 Project Status

**Phase 1**: 🔄 In Progress  
**Phase 2**: ⏳ Planned  
**Phase 3**: ⏳ Planned  
**Phase 4**: ⏳ Planned  
**Phase 5**: ⏳ Planned

Target: Complete MVP in 10-12 weeks

---

## 🎯 Current Sprint Goal

**Complete Phase 1**: Authentication working end-to-end

Success = User can:
1. Visit app
2. Sign in with Google/Microsoft
3. See personalized dashboard
4. Sign out and back in
5. Session persists

---

*This context file helps Cursor AI understand the project quickly. Update as phases progress.*