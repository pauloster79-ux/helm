# Helm - AI-Powered Project Management Platform

**Current Phase**: Phase 1 - Foundation & Authentication 🚧

Helm is an AI-powered project management platform that helps teams plan, track, and deliver projects more effectively. This repository contains the MVP build, currently in Phase 1.

## 🚀 Quick Start - Phase 1

### Prerequisites
- Node.js 18+
- Supabase account (free tier)
- Google Cloud Console account (for OAuth)
- Microsoft Azure account (for OAuth)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/helm.git
   cd helm
   ```

2. **Create Supabase project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Apply the database schema from `docs/architecture/DATABASE_SCHEMA.sql`
   - Configure Google and Microsoft OAuth providers
   - Get your project URL and anon key

3. **Configure environment**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   - Navigate to http://localhost:5173
   - Sign in with Google or Microsoft
   - You should see the dashboard!

For detailed setup instructions, see [PHASE_1_CHECKLIST.md](docs/mvp/PHASE_1_CHECKLIST.md).

## 📋 Project Status

### Phase 1: Foundation & Authentication (Current)
**Goal**: Get authentication working with a basic UI shell

**Status**: 🚧 In Progress
- ✅ Project structure created
- ✅ Frontend initialized with React + TypeScript + Vite
- ✅ Supabase client configured
- ✅ Auth components created
- ✅ Protected routes implemented
- ⏳ Supabase project setup (manual step)
- ⏳ OAuth providers configured (manual step)
- ⏳ End-to-end auth testing

See [CURRENT_PHASE.md](docs/mvp/CURRENT_PHASE.md) for detailed progress.

### Upcoming Phases
- **Phase 2**: Database & Basic PM Features (Projects, Tasks)
- **Phase 3**: AI Integration (OpenAI, task generation)
- **Phase 4**: Real-time & Collaboration
- **Phase 5**: Polish & Mobile

See [MVP_SCOPE.md](docs/product/MVP_SCOPE.md) for full roadmap.

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Built-in authentication (OAuth)
  - Row-Level Security (RLS)
  - Real-time subscriptions

### Future (Phase 3+)
- **NestJS** - Node.js backend (AI operations only)
- **FastAPI** - Python service (OpenAI integration)

## 📁 Project Structure

```
helm/
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── auth/         # Auth-related components
│   │   │   └── common/       # Shared components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts (AuthContext)
│   │   ├── lib/              # External services (Supabase)
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Main app with routing
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
├── docs/
│   ├── architecture/         # Technical architecture docs
│   ├── product/             # Product specs and roadmap
│   └── mvp/                 # MVP-specific docs
├── .cursorrules             # Cursor AI project rules
├── .gitignore
└── README.md
```

## 🎯 Architecture

Helm uses a **Supabase-first** architecture:

- **Frontend → Supabase** for all CRUD operations
- **No custom backend** for basic database operations
- Supabase handles: Auth, Database, RLS, Real-time
- Custom backend (NestJS) only for AI operations (Phase 3+)

This approach:
- ✅ Reduces complexity
- ✅ Faster MVP development
- ✅ Lower infrastructure costs
- ✅ Built-in security with RLS

See [ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) for details.

## 🔐 Authentication

Phase 1 supports OAuth authentication:
- ✅ Google OAuth
- ✅ Microsoft OAuth
- ✅ Protected routes
- ✅ Session persistence

**No password authentication** in MVP (reduces security complexity).

## 🗄️ Database Schema

Phase 1 includes basic tables:
- `profiles` - User profiles (extends Supabase auth.users)
- `projects` - User projects
- `tasks` - Tasks within projects

All tables have Row-Level Security (RLS) policies ensuring users can only access their own data.

See [DATABASE_SCHEMA.sql](docs/architecture/DATABASE_SCHEMA.sql) for complete schema.

## 🛠️ Development

### Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

Required in `frontend/.env`:
```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Never commit `.env` files!** They're in `.gitignore`.

## 📚 Documentation

- [Phase 1 Checklist](docs/mvp/PHASE_1_CHECKLIST.md) - Detailed setup steps
- [Current Phase Status](docs/mvp/CURRENT_PHASE.md) - Progress tracking
- [MVP Scope](docs/product/MVP_SCOPE.md) - Full MVP roadmap
- [Architecture](docs/architecture/ARCHITECTURE.md) - Technical design
- [Database Schema](docs/architecture/DATABASE_SCHEMA.sql) - Database design
- [Tech Decisions](docs/architecture/TECH_DECISIONS.md) - Decision log

## 🐛 Troubleshooting

### Common Issues

**OAuth redirect not working**
- Check redirect URL in OAuth provider matches Supabase exactly
- Format: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

**Environment variables not loading**
- Ensure file is named `.env` (not `.env.example`)
- Restart dev server after changing .env
- Verify variables are prefixed with `VITE_`

**Supabase connection errors**
- Check URL and anon key are correct
- Verify Supabase project is active (not paused)
- Check browser console for specific errors

See [PHASE_1_CHECKLIST.md](docs/mvp/PHASE_1_CHECKLIST.md#troubleshooting) for more.

## 🤖 Working with Cursor AI

This project is optimized for Cursor AI development:
- See `.cursorrules` for project guidelines
- Use `@Codebase` to ask questions about the project
- All conventions and patterns are documented

Example prompts:
```
@Codebase How does authentication work?
@Codebase Where are the RLS policies defined?
@Codebase Help me add a new protected route
```

## 📝 Contributing

This is currently an MVP project. Contribution guidelines will be added in future phases.

## 📄 License

Proprietary - All rights reserved

## 🔗 Links

- [Supabase Dashboard](https://app.supabase.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Microsoft Azure Portal](https://portal.azure.com)

## 📧 Contact

For questions or issues, contact the project maintainer.

---

**Phase 1 Progress**: 🚧 In Progress  
**Next Milestone**: Complete OAuth setup and test authentication flow

**Built with ❤️ using Cursor AI and Supabase**
