# Helm MVP Scope

**Version**: 1.0  
**Status**: Phase 1 in progress  
**Timeline**: 10-12 weeks to complete MVP  
**Full Vision**: See [`/docs/vision/`](../vision/) for complete platform design

---

## 🎯 MVP Goal

**Build a working project management platform with AI-powered task validation that proves the core value proposition: "AI proposes, humans approve."**

### Success Criteria

By end of MVP, users can:
1. ✅ Sign in with OAuth (Google/Microsoft)
2. ✅ Create and manage projects
3. ✅ Create and update tasks with natural language
4. ✅ Receive AI-powered improvement suggestions
5. ✅ Review and approve/reject AI proposals
6. ✅ See AI proposals working in real-time
7. ✅ Track AI costs transparently
8. ✅ Collaborate with team members

### What's NOT in MVP

(But IS in full vision - see [`/docs/vision/functional-spec.md`](../vision/functional-spec.md))

- ❌ Risks, Decisions, Milestones (Phase 2 of full platform)
- ❌ Plan view / Gantt chart
- ❌ Daily AI analysis
- ❌ Document intelligence
- ❌ Slack/Teams integrations
- ❌ Advanced reporting
- ❌ Resource management

---

## 📅 Phase Breakdown

## Phase 1: Foundation & Authentication
**Timeline**: Weeks 1-2  
**Status**: 🔄 In Progress

### Goal
Get users authenticated and show them an empty dashboard.

### Deliverables
- ✅ Supabase project setup
- ✅ PostgreSQL database with Phase 1 schema
- ✅ OAuth authentication (Google + Microsoft)
- ✅ User profiles auto-created on signup
- ✅ Organizations auto-created for new users
- ✅ React frontend with Tailwind CSS
- ✅ Protected routing
- ✅ Basic dashboard shell

### User Journey
```
User visits app
  → Clicks "Sign in with Google/Microsoft"
  → Completes OAuth flow
  → Sees personalized dashboard
  → Can sign out and back in
  → Session persists across refreshes
```

### Success Metrics
- User can complete full auth flow in <1 minute
- Session persists for 7 days
- OAuth works for both providers
- No console errors

### Database Tables (Phase 1)
- `organizations` - One per user initially
- `user_profiles` - Extends Supabase auth.users
- `projects` - Empty for now
- `project_members` - Empty for now

### Technical Details
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: Supabase (managed PostgreSQL)
- **Auth**: Supabase Auth with OAuth providers
- **Styling**: Tailwind CSS
- **State**: React Context for auth

**Guide**: See [`PHASE_1_GUIDE.md`](PHASE_1_GUIDE.md) for implementation steps

---

## Phase 2: Core CRUD (No AI Yet)
**Timeline**: Weeks 3-4  
**Status**: ⏳ Planned

### Goal
Add project and task management WITHOUT AI. Get basic CRUD working first.

### Deliverables
- Project CRUD (create, view, list, edit, delete)
- Task CRUD (create, view, list, edit, delete)
- Task fields:
  - Title, description
  - Status (To Do, In Progress, Review, Done)
  - Latest Position (manual text updates)
  - Owner assignment
  - Progress percentage
- Task list view with filters
- Task detail modal/panel
- Team member management (invite, view, remove)
- Project switching (if user in multiple projects)

### User Journey
```
User creates a project
  → Invites team members
  → Creates tasks manually
  → Assigns tasks to team members
  → Updates Latest Position with progress notes
  → Changes task status
  → Views list of all tasks
```

### Why No AI Yet?
1. Proves CRUD operations work
2. Tests Supabase Row-Level Security
3. Validates UI/UX patterns
4. Establishes data flow
5. Makes Phase 3 (AI) a clean add-on

### Database Tables Added
- Complete `tasks` table
- `task_dependencies` (optional, can add in Phase 3)
- Extended `project_members` with roles

### Technical Details
- **Data layer**: Supabase client for all CRUD
- **Forms**: React Hook Form + Zod validation
- **State**: React Query for server state
- **UI**: Shadcn/ui components (optional)

**No AI in Phase 2!** Just working CRUD operations.

---

## Phase 3: AI Integration & Proposals
**Timeline**: Weeks 5-6  
**Status**: ⏳ Planned

### Goal
Add AI validation and proposal system. This is the **core differentiator**.

### Deliverables

#### AI Validation
- Field-level validation (as you type)
- Component-level validation (when you save)
- Three validation levels:
  - Rules-only (fast, cheap)
  - Selective context (moderate)
  - Full context (thorough)
- AI model selection (GPT-4o-mini, GPT-4o, Claude)

#### Proposal System
- Proposals table and UI
- Proposal types:
  - Field improvements (better title/description)
  - Missing information (add acceptance criteria)
  - Consistency corrections (status conflicts)
- Proposal cards showing:
  - What would change
  - Why (rationale)
  - Confidence level
  - Accept/Reject/Modify actions
- Proposal dashboard (review all pending)
- Proposal history (audit trail)

#### Cost Tracking
- AI usage logging
- Cost calculation per operation
- Monthly cost dashboard
- Cost warnings when approaching limits

#### Backend API
- **NestJS API** (finally adding backend!)
- Endpoints:
  - `POST /api/ai/validate` - Validate component
  - `GET /api/proposals` - List proposals
  - `POST /api/proposals/:id/accept` - Accept proposal
  - `POST /api/proposals/:id/reject` - Reject proposal
- **Python AI Service** (FastAPI)
  - OpenAI/Anthropic integration
  - Prompt management
  - Context assembly
  - Cost calculation

### User Journey
```
User creates a task with vague title: "fix the bug"
  → Types description
  → As they type, AI suggests improvements
  → "Proposal: Change title to 'Fix authentication timeout for SSO users'"
  → User sees rationale
  → User clicks "Accept"
  → Title updates automatically
  → User continues editing with AI help
```

### Database Tables Added
- `proposals` - All AI proposals
- `ai_configurations` - Per-project AI settings
- `ai_usage_logs` - Cost tracking

### Technical Details
- **Backend**: NestJS + PostgreSQL (via Supabase)
- **AI Service**: FastAPI + Python
- **LLM Providers**: OpenAI, Anthropic
- **Caching**: Redis for AI responses
- **Queue**: Bull for async AI processing

**This is the most complex phase!** Takes 2 weeks for good reason.

---

## Phase 4: Real-time & Collaboration
**Timeline**: Weeks 7-8  
**Status**: ⏳ Planned

### Goal
Multiple users can work on the same project simultaneously.

### Deliverables
- Real-time task updates (via Supabase Realtime)
- Live cursors showing who's editing what
- Conflict resolution (optimistic updates)
- Comments on tasks
- @mentions in comments
- Notifications:
  - In-app notifications
  - Email notifications (optional)
- Activity feed (who did what when)

### User Journey
```
Sarah (PM) views task list
  → Mike (contributor) updates a task
  → Sarah sees update appear live
  → Sarah adds comment to task
  → Mike gets notification
  → Mike responds to comment
  → Both see changes in real-time
```

### Database Tables Added
- `comments` - Task comments
- `notifications` - User notifications
- `activity_log` - Audit trail

### Technical Details
- **Real-time**: Supabase Realtime (WebSocket)
- **Optimistic updates**: React Query optimistic mutations
- **Presence**: Supabase Presence API
- **Notifications**: Supabase Edge Functions

---

## Phase 5: Polish & Mobile
**Timeline**: Weeks 9-10  
**Status**: ⏳ Planned

### Goal
Production-ready polish and mobile experience.

### Deliverables
- Mobile-responsive UI (all views work on phone)
- Touch-optimized interactions
- Offline support (basic)
- Error boundaries and graceful failures
- Loading states and skeletons
- Empty states for all views
- Onboarding flow for new users
- Help documentation
- Performance optimization:
  - Code splitting
  - Image optimization
  - Bundle size reduction
- Accessibility improvements:
  - Keyboard navigation
  - Screen reader support
  - ARIA labels
- Browser compatibility testing
- Bug fixes from user feedback

### User Journey
```
User opens app on phone
  → Sees mobile-optimized UI
  → Can create/update tasks with touch
  → Swipe gestures work
  → Responsive to device orientation
  → Works offline (cached data)
```

### Technical Details
- **Responsive**: Tailwind responsive classes
- **PWA**: Service worker for offline
- **Performance**: Lighthouse score >90
- **Testing**: Playwright E2E tests
- **Monitoring**: Sentry for errors

---

## 🎯 MVP Completion Criteria

### Functional
- [ ] Authentication works (both OAuth providers)
- [ ] Can create/manage projects
- [ ] Can create/update/delete tasks
- [ ] AI suggestions appear when editing
- [ ] Can accept/reject proposals
- [ ] Changes apply immediately
- [ ] Multiple users can collaborate
- [ ] Real-time updates work
- [ ] Mobile experience is usable

### Technical
- [ ] All tests passing (>80% coverage)
- [ ] No console errors in production
- [ ] Lighthouse score >90
- [ ] Page load <2 seconds
- [ ] AI response <5 seconds
- [ ] Works on Chrome, Firefox, Safari
- [ ] Mobile responsive (tested on 3 devices)

### Business
- [ ] AI costs tracked and visible
- [ ] Can complete full user flow in <5 minutes
- [ ] NPS score >50 from beta users
- [ ] <5 critical bugs in production

---

## 📊 Timeline & Milestones

```
Week 1-2:  ██████████ Phase 1: Auth & Foundation
Week 3-4:  ░░░░░░░░░░ Phase 2: Core CRUD
Week 5-6:  ░░░░░░░░░░ Phase 3: AI Integration ⭐ (Most important)
Week 7-8:  ░░░░░░░░░░ Phase 4: Real-time
Week 9-10: ░░░░░░░░░░ Phase 5: Polish

Week 11: Final testing & bug fixes
Week 12: Beta launch 🚀
```

### Key Milestones

| Week | Milestone | Demo-able Feature |
|------|-----------|-------------------|
| 2 | ✅ Auth working | "Sign in and see dashboard" |
| 4 | ✅ CRUD working | "Create project and tasks" |
| 6 | ✅ AI working | "AI suggests improvements" ⭐ |
| 8 | ✅ Collaboration | "See live updates from team" |
| 10 | ✅ Production ready | "Works on phone, no bugs" |

---

## 🔄 Evolution to Full Platform

**After MVP**, we'll add features from the full vision:

**Post-MVP Phase 1: Project Management Depth**
- Risks component
- Decisions component
- Milestones component
- Plan view (Gantt chart)
- Dependencies visualization

**Post-MVP Phase 2: AI Intelligence**
- Daily AI analysis
- Pattern detection
- Risk prediction
- Timeline optimization
- Document intelligence

**Post-MVP Phase 3: Integrations**
- Slack integration
- Microsoft Teams integration
- Email integration
- Calendar sync
- Webhook API

**Post-MVP Phase 4: Enterprise**
- SSO (SAML)
- Advanced permissions
- Audit logs
- Compliance features
- Custom branding

See [`MVP_TO_FULL_MAP.md`](MVP_TO_FULL_MAP.md) for detailed evolution plan.

See [`/docs/vision/`](../vision/) for complete platform specifications.

---

## 🎯 Current Focus

**We are in Phase 1** (Foundation & Authentication)

**Next Steps:**
1. Complete Phase 1 checklist in [`CURRENT_PHASE.md`](CURRENT_PHASE.md)
2. Follow [`PHASE_1_GUIDE.md`](PHASE_1_GUIDE.md) for implementation
3. Test thoroughly before moving to Phase 2

**Questions?** Check:
- Implementation: [`PHASE_1_GUIDE.md`](PHASE_1_GUIDE.md)
- Architecture: [`MVP_ARCHITECTURE.md`](MVP_ARCHITECTURE.md)
- Full vision: [`/docs/vision/functional-spec.md`](../vision/functional-spec.md)

---

*Last Updated: 2025-10-06*  
*Next Review: After Phase 1 completion*