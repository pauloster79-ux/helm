# Technical Decision Log

## Overview
This document records key technical decisions made during Helm development, including rationale and trade-offs.

---

## Decision 1: Supabase-First Architecture

**Date**: October 2025  
**Status**: ✅ Accepted

### Context
Need to choose between building a custom backend (Node.js/Express + PostgreSQL) or using a Backend-as-a-Service (Supabase).

### Decision
Use Supabase as the primary backend, with custom NestJS backend only for AI operations.

### Rationale
**Pros**:
- Faster MVP development (auth, database, real-time out of the box)
- Lower infrastructure costs (managed service)
- Built-in security with Row-Level Security
- Real-time subscriptions included
- Excellent TypeScript support
- Strong community and documentation

**Cons**:
- Vendor lock-in (mitigated: PostgreSQL is standard)
- Less control over database optimizations
- May need custom backend for complex operations

### Alternatives Considered
1. **Custom Node.js + PostgreSQL**: More control but slower to build
2. **Firebase**: Good, but less SQL flexibility and more vendor lock-in
3. **AWS Amplify**: More complex, steeper learning curve

### Outcome
Supabase-first approach will significantly speed up MVP while maintaining flexibility to add custom backend later.

---

## Decision 2: React + TypeScript + Vite

**Date**: October 2025  
**Status**: ✅ Accepted

### Context
Need to choose frontend framework and build tooling.

### Decision
Use React 18 with TypeScript and Vite for build tooling.

### Rationale
**React**:
- Large ecosystem and community
- Excellent TypeScript support
- Good hiring pool
- Mature and stable

**TypeScript**:
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Industry standard

**Vite**:
- Much faster than Webpack/CRA
- Simple configuration
- Great DX with HMR
- Native ESM support

### Alternatives Considered
1. **Next.js**: Overkill for MVP (SSR not needed), heavier
2. **Vue**: Smaller ecosystem, team knows React better
3. **Svelte**: Less mature, smaller hiring pool

### Outcome
React + TS + Vite provides the best balance of speed, DX, and maintainability.

---

## Decision 3: Tailwind CSS for Styling

**Date**: October 2025  
**Status**: ✅ Accepted

### Context
Need to choose styling approach that's fast to develop with and maintainable.

### Decision
Use Tailwind CSS with utility-first approach.

### Rationale
**Pros**:
- Extremely fast to prototype
- No CSS naming conventions needed
- Small production bundle (only used classes)
- Consistent design system
- Great responsive utilities
- Easy to customize

**Cons**:
- HTML can look cluttered
- Learning curve for team
- Need to extract components to avoid repetition

### Alternatives Considered
1. **CSS Modules**: More boilerplate, slower development
2. **Styled Components**: Runtime cost, more code
3. **MUI/Chakra**: Too opinionated, harder to customize

### Outcome
Tailwind provides fastest path to a good-looking MVP while staying flexible.

---

## Decision 4: OAuth Only (No Password Auth)

**Date**: October 2025  
**Status**: ✅ Accepted

### Context
Need to decide which authentication methods to support for MVP.

### Decision
Only support OAuth (Google, Microsoft) for Phase 1. No password-based auth.

### Rationale
**Pros**:
- Simpler to implement
- Better security (no password management)
- Users trust OAuth providers
- No "forgot password" flow needed
- No password validation requirements

**Cons**:
- Users without Google/Microsoft accounts excluded
- Dependency on third-party services
- Slightly slower first-time login

### Alternatives Considered
1. **Password Auth**: More complex, security concerns
2. **Magic Links**: Good, but slower UX
3. **Phone Auth**: Expensive (SMS costs)

### Outcome
OAuth-only is perfect for MVP targeting professional users who likely have Google/Microsoft accounts.

---

## Decision 5: NestJS for Custom Backend

**Date**: October 2025  
**Status**: ✅ Accepted (Phase 3+)

### Context
When we need custom backend (AI operations), which framework to use?

### Decision
Use NestJS for custom backend when needed (Phase 3+).

### Rationale
**Pros**:
- TypeScript native
- Well-structured (follows Angular patterns)
- Great for building scalable APIs
- Excellent dependency injection
- Strong community
- Good testing support

**Cons**:
- Steeper learning curve than Express
- More boilerplate than bare Express

### Alternatives Considered
1. **Express**: Simpler but less structured
2. **Fastify**: Faster but less mature ecosystem
3. **tRPC**: Great DX but less flexible for REST

### Outcome
NestJS provides the best structure for a backend that will grow beyond MVP.

---

## Decision 6: FastAPI for AI Service

**Date**: October 2025  
**Status**: ✅ Accepted (Phase 3+)

### Context
Need to integrate with OpenAI API. Which framework for the AI service?

### Decision
Use FastAPI (Python) for AI service layer.

### Rationale
**Pros**:
- Best ecosystem for AI/ML (OpenAI SDK, LangChain, etc.)
- Fast performance (async/await)
- Great type hints with Pydantic
- Automatic API docs
- Easy to deploy

**Cons**:
- Adds another language to stack
- Requires separate deployment

### Alternatives Considered
1. **Node.js OpenAI SDK**: Smaller ecosystem for AI
2. **All-in-one in NestJS**: Less separation of concerns
3. **Separate Python functions**: Less structured

### Outcome
Python/FastAPI is the right tool for AI operations, worth the extra complexity.

---

## Decision 7: Monorepo Structure

**Date**: October 2025  
**Status**: ✅ Accepted

### Context
How to organize code for frontend, backend, and AI service?

### Decision
Use a monorepo with separate directories for each service.

### Rationale
**Pros**:
- Single git repository (easier version control)
- Share types between services
- Easier refactoring across services
- Simpler CI/CD
- Better for small team

**Cons**:
- Can grow large over time
- Need tooling for managing multiple projects

### Alternatives Considered
1. **Polyrepo (separate repos)**: More isolation but harder to sync
2. **Turborepo/Nx**: Overkill for MVP

### Outcome
Simple monorepo with folders is best for MVP, can add tooling later if needed.

---

## Decision 8: No Custom State Management

**Date**: October 2025  
**Status**: ✅ Accepted

### Context
Do we need Redux/Zustand/Jotai for state management?

### Decision
Use React Context + hooks only. No external state management library.

### Rationale
**Pros**:
- Less complexity
- React Context is sufficient for MVP
- Faster development
- Less boilerplate

**Cons**:
- May need to refactor later
- Re-renders can be less optimized

### Alternatives Considered
1. **Redux Toolkit**: Too much boilerplate for MVP
2. **Zustand**: Good, but not needed yet
3. **Jotai/Recoil**: More modern but adds dependency

### Outcome
Start simple with Context. Can add state library later if needed.

---

## Decision 9: Manual Testing for Phase 1

**Date**: October 2025  
**Status**: ✅ Accepted

### Context
Should we write automated tests for Phase 1?

### Decision
Manual testing only for Phase 1. Add automated tests in Phase 2+.

### Rationale
**Pros**:
- Faster development for MVP
- Requirements may change frequently
- Small codebase easy to test manually

**Cons**:
- Regression risk
- No CI/CD test gates

### Alternatives Considered
1. **Full test coverage**: Too slow for MVP
2. **Critical path only**: Middle ground

### Outcome
Manual testing for Phase 1, add Jest + React Testing Library in Phase 2.

---

## Decision 10: Vercel for Frontend Hosting

**Date**: October 2025  
**Status**: ⏳ Planned (Deployment phase)

### Context
Where to host the React frontend?

### Decision
Deploy frontend to Vercel.

### Rationale
**Pros**:
- Free tier for MVP
- Automatic deployments from git
- Excellent performance (CDN)
- Easy preview deployments
- Great DX

**Cons**:
- Vendor lock-in (mitigated: easy to move)

### Alternatives Considered
1. **Netlify**: Similar to Vercel, slightly less popular
2. **AWS S3 + CloudFront**: More complex setup
3. **Railway**: Good but better for backend

### Outcome
Vercel is the standard choice for React apps, provides best DX.

---

## Future Decisions to Make

### Before Phase 2
- [ ] Database migration strategy (Supabase migrations vs. external tool)
- [ ] How to handle database schema changes
- [ ] Backup and recovery strategy

### Before Phase 3
- [ ] AI prompt management (hardcoded vs. database)
- [ ] Rate limiting strategy for OpenAI API
- [ ] Cost control mechanisms for AI features
- [ ] Caching strategy for AI responses

### Before Phase 4
- [ ] Real-time scaling strategy
- [ ] Team invitation mechanism
- [ ] Permission model (owner/admin/member)

---

Last updated: October 2025

