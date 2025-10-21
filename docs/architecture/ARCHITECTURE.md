# Helm Architecture

## Overview

Helm uses a **Supabase-first** architecture that minimizes custom backend code and leverages managed services wherever possible.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          React Frontend (TypeScript + Vite)           │  │
│  │  - UI Components (Tailwind CSS)                       │  │
│  │  - React Router (Client-side routing)                 │  │
│  │  - Supabase Client (Auth + Database)                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           │                              │
           │ Auth + CRUD                  │ AI Operations
           │                              │
           ↓                              ↓
┌──────────────────────┐      ┌──────────────────────┐
│   Supabase (BaaS)    │      │   NestJS Backend     │
│  - PostgreSQL DB     │      │  - AI API Routes     │
│  - Auth (OAuth)      │      │  - Business Logic    │
│  - Row-Level Security│      └──────────────────────┘
│  - Real-time         │                 │
│  - Storage           │                 │
└──────────────────────┘                 ↓
                              ┌──────────────────────┐
                              │  FastAPI Service     │
                              │  - OpenAI Integration│
                              │  - Prompt Engineering│
                              └──────────────────────┘
```

## Core Principles

### 1. Supabase-First
**Philosophy**: Use Supabase for everything possible before building custom backend

**What Supabase Handles**:
- ✅ User authentication (OAuth)
- ✅ Database (PostgreSQL with extensions)
- ✅ Row-Level Security (RLS) for authorization
- ✅ Real-time subscriptions
- ✅ File storage (future phase)
- ✅ Edge functions (future phase)

**What Goes in Custom Backend**:
- AI operations (OpenAI API calls)
- Complex business logic (multi-step operations)
- Third-party integrations (Slack, email, etc.)
- Scheduled jobs (future phase)

### 2. Security by Default
**Row-Level Security (RLS)**:
- All database tables have RLS enabled
- Policies enforce data access at the database level
- Frontend uses `anon` key (never service key)
- Users can only access their own data

**Authentication**:
- OAuth only (Google, Microsoft)
- No password authentication (reduces security risk)
- JWT tokens managed by Supabase
- Session persistence in local storage

### 3. Type Safety Everywhere
**TypeScript Across Stack**:
- Frontend: React with TypeScript
- Backend: NestJS with TypeScript
- Supabase: Generated types from database schema
- Shared types between frontend and backend

### 4. Real-time by Design
**Supabase Real-time**:
- Database changes streamed to clients
- No polling required
- Automatic UI updates
- Scales to thousands of concurrent users

## Data Flow

### CRUD Operations (Simple Path)
```
User Action → React Component → Supabase Client → PostgreSQL
                                     ↓
                         Check RLS Policies → Return Data
                                     ↓
                              Update UI State
```

### AI Operations (Complex Path)
```
User Request → React Component → NestJS API → FastAPI Service
                                                    ↓
                                            OpenAI API Call
                                                    ↓
                                              Process Response
                                                    ↓
                                         Return to NestJS
                                                    ↓
                             Save to Database via Supabase
                                                    ↓
                                 Return to Frontend + Update UI
```

## Technology Stack

### Frontend
- **React 18**: Component-based UI
- **TypeScript**: Type safety
- **Vite**: Fast development and builds
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Supabase JS Client**: Database and auth

### Backend (Phase 3+)
- **NestJS**: TypeScript Node.js framework
- **Express**: HTTP server
- **Supabase Admin Client**: Server-side operations

### AI Service (Phase 3+)
- **FastAPI**: Modern Python framework
- **OpenAI Python SDK**: AI integration
- **Pydantic**: Data validation

### Database
- **Supabase (PostgreSQL 15)**:
  - PostGIS extension (for future location features)
  - pg_cron (for scheduled tasks)
  - pg_stat_statements (for performance monitoring)

## Database Schema (Phase 2+)

### Tables

#### `profiles` (extends Supabase auth.users)
```sql
- id (uuid, FK to auth.users)
- email (text)
- full_name (text)
- avatar_url (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `projects`
```sql
- id (uuid)
- user_id (uuid, FK to profiles)
- name (text)
- description (text)
- status (enum: planning, active, completed, archived)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `tasks`
```sql
- id (uuid)
- project_id (uuid, FK to projects)
- user_id (uuid, FK to profiles)
- title (text)
- description (text)
- status (enum: todo, in_progress, done)
- priority (enum: low, medium, high)
- estimated_hours (numeric)
- created_at (timestamp)
- updated_at (timestamp)
```

### RLS Policies

All tables follow this pattern:
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own records" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users can insert own records" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "Users can update own records" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own data
CREATE POLICY "Users can delete own records" ON table_name
  FOR DELETE USING (auth.uid() = user_id);
```

## Authentication Flow

### OAuth Login
1. User clicks "Sign in with Google/Microsoft"
2. Frontend calls `supabase.auth.signInWithOAuth({ provider })`
3. User redirected to OAuth provider
4. User authorizes app
5. OAuth provider redirects back with code
6. Supabase exchanges code for session
7. Frontend receives session and user object
8. Session stored in local storage
9. User redirected to dashboard

### Session Management
- Session automatically refreshed by Supabase client
- `onAuthStateChange` listener updates app state
- Expired sessions trigger re-authentication
- Logout clears local storage and revokes session

## API Design (Phase 3+)

### RESTful Endpoints

**AI Operations**:
- `POST /api/ai/analyze-project` - Analyze project description
- `POST /api/ai/generate-tasks` - Generate task breakdown
- `POST /api/ai/estimate-time` - Estimate task durations
- `POST /api/ai/detect-risks` - Identify project risks

**Format**:
```typescript
// Request
{
  projectId: string;
  description: string;
}

// Response
{
  success: boolean;
  data: any;
  error?: string;
}
```

## Error Handling

### Frontend
- Loading states for async operations
- Error boundaries for component crashes
- User-friendly error messages
- Console logging in development
- Error tracking (Sentry in production)

### Backend
- Try-catch for all async operations
- Structured error responses
- Rate limiting
- Request validation

## Performance Considerations

### Frontend
- Code splitting by route
- Lazy loading components
- Memoization for expensive computations
- Virtual scrolling for long lists (future)
- Image optimization (future)

### Backend
- Connection pooling
- Query optimization
- Caching (Redis in future)
- Rate limiting
- CDN for static assets

### Database
- Proper indexes on foreign keys
- Partial indexes for filtered queries
- Regular VACUUM and ANALYZE
- Query performance monitoring

## Deployment Architecture (Future)

```
┌─────────────┐
│   Vercel    │  Frontend (React app)
└─────────────┘
       │
       ↓
┌─────────────┐
│  Supabase   │  Database + Auth + Real-time
└─────────────┘
       │
       ↓
┌─────────────┐
│   Railway   │  NestJS Backend
└─────────────┘
       │
       ↓
┌─────────────┐
│   Railway   │  FastAPI Service
└─────────────┘
```

### Hosting Choices
- **Frontend**: Vercel (automatic deploys, CDN, serverless)
- **Backend**: Railway (simple, affordable, good DX)
- **Database**: Supabase (managed PostgreSQL)
- **AI Service**: Railway (Python runtime, auto-scaling)

## Monitoring & Observability (Future)

### Metrics
- Frontend: Vercel Analytics
- Backend: Railway metrics
- Database: Supabase dashboard
- Errors: Sentry
- User analytics: PostHog or Mixpanel

### Logging
- Structured JSON logs
- Log levels (debug, info, warn, error)
- Request ID tracing
- Searchable in production

## Security Best Practices

### Frontend
- ✅ No secrets in code (only public keys)
- ✅ HTTPS only
- ✅ Content Security Policy headers
- ✅ Input validation
- ✅ XSS prevention (React escapes by default)

### Backend
- ✅ Environment variables for secrets
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Request validation
- ✅ SQL injection prevention (RLS + Supabase client)

### Database
- ✅ RLS enabled on all tables
- ✅ Minimal permissions for service role
- ✅ Regular backups (Supabase automatic)
- ✅ Audit logs for sensitive operations

## Future Architecture Enhancements

### Phase 4+
- Redis caching layer
- WebSocket server for advanced real-time
- Message queue (BullMQ) for background jobs
- CDN for uploaded files
- Database read replicas

### Phase 5+
- Microservices if needed
- Kubernetes for orchestration
- Service mesh for observability
- GraphQL API (if REST becomes limiting)

---

Last updated: October 2025

