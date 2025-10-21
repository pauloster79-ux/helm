# Phase 1 Implementation Guide

**Goal**: Get authentication working with Supabase OAuth

**Time Estimate**: 1-2 days for experienced developers, 3-4 days if new to Supabase

---

## Day 1, Part 1: Supabase Setup (30-60 minutes)

### Step 1: Create Supabase Project

1. **Go to** https://supabase.com
2. **Sign up** or log in
3. **Click** "New Project"
4. **Fill in**:
   - Organization: (create one if needed)
   - Name: `helm-mvp-dev`
   - Database Password: (generate strong password, save it!)
   - Region: Choose closest to you
   - Pricing Plan: Free tier is fine for development

5. **Wait** ~2 minutes for project to provision

6. **Save these credentials** (you'll need them):
   ```
   Project URL: https://[project-ref].supabase.co
   Anon (public) key: eyJhbG...
   Service role key: eyJhbG... (keep this secret!)
   ```
   
   Find these in: Project Settings → API

### Step 2: Run Database Schema

1. **In Supabase Dashboard**, go to: SQL Editor
2. **Click** "+ New Query"
3. **Paste this schema**:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================
-- ORGANIZATIONS
-- ==============================================
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own organization"
    ON public.organizations FOR SELECT
    USING (
        id IN (
            SELECT organization_id 
            FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- ==============================================
-- USER PROFILES
-- Extends Supabase auth.users
-- ==============================================
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id),
    full_name VARCHAR(200),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (id = auth.uid());

-- ==============================================
-- PROJECTS
-- ==============================================
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization's projects"
    ON public.projects FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- ==============================================
-- PROJECT MEMBERS
-- ==============================================
CREATE TABLE public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'contributor',
    -- viewer, contributor, project_manager
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- RLS Policies for project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project members for their projects"
    ON public.project_members FOR SELECT
    USING (
        project_id IN (
            SELECT id 
            FROM public.projects 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM public.user_profiles 
                WHERE user_id = auth.uid()
            )
        )
    );

-- ==============================================
-- FUNCTIONS
-- ==============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
    org_name TEXT;
BEGIN
    -- Extract name from email (before @)
    org_name := split_part(NEW.email, '@', 1) || '''s Organization';
    
    -- Create organization for new user
    INSERT INTO public.organizations (name, slug)
    VALUES (
        org_name,
        split_part(NEW.email, '@', 1) || '-' || substr(md5(random()::text), 1, 6)
    )
    RETURNING id INTO new_org_id;
    
    -- Create user profile
    INSERT INTO public.user_profiles (id, organization_id, full_name, avatar_url)
    VALUES (
        NEW.id,
        new_org_id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- INDEXES for Performance
-- ==============================================
CREATE INDEX idx_user_profiles_org ON public.user_profiles(organization_id);
CREATE INDEX idx_projects_org ON public.projects(organization_id);
CREATE INDEX idx_project_members_project ON public.project_members(project_id);
CREATE INDEX idx_project_members_user ON public.project_members(user_id);
```

4. **Click** "Run" (or press `Cmd+Enter`)
5. **Verify** no errors appear
6. **Check** tables were created:
   - Go to Table Editor
   - Should see: organizations, user_profiles, projects, project_members

### Step 3: Configure Google OAuth

1. **Go to** [Google Cloud Console](https://console.cloud.google.com)
2. **Create a new project** or select existing
3. **Go to**: APIs & Services → OAuth consent screen
4. **Configure**:
   - User Type: External
   - App name: Helm MVP
   - User support email: your email
   - Developer email: your email
5. **Save and Continue** through screens
6. **Go to**: APIs & Services → Credentials
7. **Click**: Create Credentials → OAuth client ID
8. **Select**: Web application
9. **Configure**:
   - Name: Helm MVP Web
   - Authorized redirect URIs: 
     ```
     https://[your-project-ref].supabase.co/auth/v1/callback
     ```
     (Replace `[your-project-ref]` with your actual Supabase project reference from Project URL)
10. **Click** Create
11. **Copy** Client ID and Client Secret
12. **In Supabase Dashboard**:
    - Go to: Authentication → Providers
    - Enable Google
    - Paste Client ID and Client Secret
    - Save

### Step 4: Configure Microsoft OAuth

1. **Go to** [Azure Portal](https://portal.azure.com)
2. **Search for** "Azure Active Directory" or "Microsoft Entra ID"
3. **Go to**: App registrations → New registration
4. **Configure**:
   - Name: Helm MVP
   - Supported account types: Accounts in any organizational directory and personal Microsoft accounts
   - Redirect URI: Web, `https://[your-project-ref].supabase.co/auth/v1/callback`
5. **Register**
6. **Copy** Application (client) ID
7. **Go to**: Certificates & secrets → New client secret
8. **Create secret**, copy the **Value** (not the Secret ID)
9. **In Supabase Dashboard**:
    - Go to: Authentication → Providers
    - Enable Azure (Microsoft)
    - Paste Client ID and Client Secret
    - Azure Tenant: Set to "common" (for all accounts)
    - Save

### Step 5: Test OAuth in Supabase

1. **In Supabase Dashboard**, go to: Authentication → Users
2. **Click** "Invite User"
3. **Try signing in** with test Google/Microsoft account
4. **Verify** user appears in Users table
5. **Check** `user_profiles` and `organizations` tables were auto-created

---

## Day 1, Part 2: Frontend Setup (1-2 hours)

### Step 6: Initialize Frontend Project

**In your terminal** (in the `helm` project root):

```bash
# Create frontend directory
mkdir -p frontend
cd frontend

# Initialize package.json
npm init -y

# Install core dependencies
npm install react react-dom react-router-dom
npm install @supabase/supabase-js

# Install dev dependencies
npm install -D vite @vitejs/plugin-react
npm install -D typescript @types/react @types/react-dom @types/node
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Initialize Tailwind
npx tailwindcss init -p
```

### Step 7: Configure Project Files

**Create `frontend/vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
```

**Create `frontend/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Create `frontend/tsconfig.node.json`:**
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**Update `frontend/tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Create `frontend/index.html`:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Helm MVP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Create `frontend/.env.local`:**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

(Replace with your actual Supabase credentials from Step 1)

**Update `frontend/package.json` scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx"
  }
}
```

### Step 8: Create Source Files

**Create `frontend/src/main.tsx`:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Create `frontend/src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Create `frontend/src/lib/supabase/client.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Create `frontend/src/contexts/AuthContext.tsx`:**
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithMicrosoft = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signInWithGoogle,
      signInWithMicrosoft,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

**Create `frontend/src/App.tsx`:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import AuthCallback from './pages/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

**Create `frontend/src/components/ProtectedRoute.tsx`:**
```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

**Create `frontend/src/pages/LoginPage.tsx`:**
```typescript
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithMicrosoft } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      await signInWithGoogle()
    } catch (err) {
      setError('Failed to sign in with Google')
      setLoading(false)
    }
  }

  const handleMicrosoftSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      await signInWithMicrosoft()
    } catch (err) {
      setError('Failed to sign in with Microsoft')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Helm</h1>
          <p className="text-gray-600">AI-powered project management</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <button
            onClick={handleMicrosoftSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#f25022" d="M1 1h10v10H1z" />
              <path fill="#00a4ef" d="M1 13h10v10H1z" />
              <path fill="#7fba00" d="M13 1h10v10H13z" />
              <path fill="#ffb900" d="M13 13h10v10H13z" />
            </svg>
            <span>Sign in with Microsoft</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
```

**Create `frontend/src/pages/AuthCallback.tsx`:**
```typescript
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase handles the OAuth callback automatically
    // Just redirect to dashboard after a brief delay
    setTimeout(() => {
      navigate('/dashboard', { replace: true })
    }, 1000)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
```

**Create `frontend/src/pages/Dashboard.tsx`:**
```typescript
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Helm</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user?.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </div>
              
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Helm!
          </h2>
          <p className="text-gray-600 mb-6">
            You're successfully authenticated. Phase 1 complete! 🎉
          </p>
          <div className="text-sm text-gray-500">
            <p>Phase 2 will add project and task management.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
```

### Step 9: Run the Application

```bash
# In frontend directory
npm run dev
```

Visit http://localhost:5173

You should see:
1. Login page
2. Click "Sign in with Google" → redirects to Google
3. After auth → redirected back to Dashboard
4. See your name/avatar
5. Can sign out

---

## 🎉 Phase 1 Complete!

If all tests pass, mark Phase 1 as complete in `CURRENT_PHASE.md` and move to Phase 2.

---

## 🐛 Troubleshooting

### OAuth redirect not working
- Check redirect URI matches exactly in OAuth provider config
- Verify URL in Supabase matches your provider settings
- Check browser console for errors

### "Invalid API key"
- Verify `.env.local` has correct Supabase credentials
- Restart dev server after changing .env
- Check Project URL and Anon Key in Supabase dashboard

### User profile not created
- Check Supabase logs (Logs & Insights in dashboard)
- Verify trigger function ran successfully
- Check `user_profiles` table for data

### Session not persisting
- Check browser localStorage (should see `sb-` keys)
- Verify `onAuthStateChange` listener is working
- Check browser console for Supabase errors

---

*Last Updated: 2025-10-06*