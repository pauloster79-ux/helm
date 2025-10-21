# Helm Documentation

**Welcome to Helm** - An AI-powered project management platform where AI proposes and humans approve.

## 🚀 Quick Start

- **New to the project?** Start with [`mvp/MVP_SCOPE.md`](mvp/MVP_SCOPE.md)
- **Setting up development?** Go to [`dev/setup.md`](dev/setup.md)
- **Implementing current phase?** Check [`mvp/CURRENT_PHASE.md`](mvp/CURRENT_PHASE.md)
- **Making architecture decisions?** Reference [`vision/`](vision/) documents

---

## 📁 Documentation Structure

### `/mvp/` - Current Implementation Focus
**What we're building RIGHT NOW through 5 incremental phases:**

| File | Purpose |
|------|---------|
| [`MVP_SCOPE.md`](mvp/MVP_SCOPE.md) | Complete 5-phase roadmap |
| [`CURRENT_PHASE.md`](mvp/CURRENT_PHASE.md) | Active phase progress tracking |
| [`MVP_ARCHITECTURE.md`](mvp/MVP_ARCHITECTURE.md) | Simplified architecture for MVP |
| [`MVP_TO_FULL_MAP.md`](mvp/MVP_TO_FULL_MAP.md) | How MVP evolves to full platform |
| [`PHASE_1_GUIDE.md`](mvp/PHASE_1_GUIDE.md) | Detailed implementation guide for Phase 1 |

**Current Phase: Phase 1 - Foundation & Authentication**

### `/vision/` - Full Platform Design
**The complete vision that guides our MVP decisions:**

These documents describe the **final platform** we're building toward. They provide context for MVP decisions to ensure we don't build ourselves into corners.

| File | Purpose |
|------|---------|
| [`functional-spec.md`](vision/functional-spec.md) | Complete feature specifications |
| [`product-design.md`](vision/product-design.md) | User personas, journeys, magic moments |
| [`user-stories.md`](vision/user-stories.md) | All 42 user stories with acceptance criteria |
| [`system-architecture.md`](vision/system-architecture.md) | Full microservices architecture |
| [`data-architecture.md`](vision/data-architecture.md) | Complete database schema |

**Important**: We're NOT building all of this in the MVP. These documents ensure our MVP choices align with the ultimate vision.

### `/architecture/` - Technical Implementation
**Detailed implementation specs and decisions:**

| File | Purpose |
|------|---------|
| [`TECH_DECISIONS.md`](architecture/TECH_DECISIONS.md) | Architecture decision log (ADRs) |
| [`api/openapi-specification.yaml`](architecture/api/openapi-specification.yaml) | API contracts |
| [`api/entities.ts`](architecture/api/entities.ts) | TypeScript type definitions |

### `/dev/` - Development Guides
**Day-to-day development resources:**

| File | Purpose |
|------|---------|
| [`setup.md`](dev/setup.md) | Development environment setup |
| [`conventions.md`](dev/conventions.md) | Code style and conventions |
| [`testing.md`](dev/testing.md) | Testing practices |

---

## 🎯 Current Development Status

**Phase**: 1 of 5 (Foundation & Authentication)  
**Status**: In Progress  
**Next Milestone**: Working OAuth login with basic dashboard

See [`mvp/CURRENT_PHASE.md`](mvp/CURRENT_PHASE.md) for detailed status.

---

## 🧭 How to Use This Documentation

### If you're implementing a feature:
1. Check [`mvp/CURRENT_PHASE.md`](mvp/CURRENT_PHASE.md) for current focus
2. Reference [`mvp/MVP_SCOPE.md`](mvp/MVP_SCOPE.md) for what's in scope
3. Look at [`vision/user-stories.md`](vision/user-stories.md) for user story details
4. Check [`architecture/api/`](architecture/api/) for API contracts

### If you're making an architecture decision:
1. Review [`mvp/MVP_TO_FULL_MAP.md`](mvp/MVP_TO_FULL_MAP.md) to see evolution path
2. Check [`vision/system-architecture.md`](vision/system-architecture.md) for final design
3. Document decision in [`architecture/TECH_DECISIONS.md`](architecture/TECH_DECISIONS.md)

### If you're setting up your environment:
1. Follow [`dev/setup.md`](dev/setup.md) step by step
2. Reference [`mvp/PHASE_1_GUIDE.md`](mvp/PHASE_1_GUIDE.md) for Phase 1 specifics

---

## 📊 MVP Phases Overview

| Phase | Timeline | Focus | Status |
|-------|----------|-------|--------|
| **Phase 1** | Weeks 1-2 | Foundation & Auth | 🔄 In Progress |
| **Phase 2** | Weeks 3-4 | Core CRUD (Tasks, Projects) | ⏳ Planned |
| **Phase 3** | Weeks 5-6 | AI Integration & Proposals | ⏳ Planned |
| **Phase 4** | Weeks 7-8 | Real-time & Collaboration | ⏳ Planned |
| **Phase 5** | Weeks 9-10 | Polish & Mobile | ⏳ Planned |

See [`mvp/MVP_SCOPE.md`](mvp/MVP_SCOPE.md) for complete phase details.

---

## 🔗 External Resources

- **Supabase Dashboard**: [Your project URL]
- **Figma Designs**: [Link when available]
- **Slack Channel**: #helm-dev
- **GitHub**: [Repository URL]

---

## 📝 Document Maintenance

- **Update frequency**: Documents updated as phases progress
- **Ownership**: 
  - MVP docs: Development lead
  - Vision docs: Product lead
  - Dev guides: Team contributors
- **Last updated**: 2025-10-06

---

*For questions about this documentation structure, see the team in #helm-dev*