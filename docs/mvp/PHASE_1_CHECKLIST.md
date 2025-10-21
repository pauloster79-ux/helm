# Phase 1: Foundation & Authentication - Detailed Checklist

## Prerequisites ✅
- [x] Node.js 18+ installed
- [x] Git installed
- [x] Cursor IDE installed
- [ ] Supabase account created (free tier)
- [ ] Google Cloud Console account (for OAuth)
- [ ] Microsoft Azure account (for OAuth)

## 1. Supabase Setup

### 1.1 Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign in / create account
- [ ] Click "New Project"
- [ ] Choose organization (or create one)
- [ ] Set project name: "helm-mvp"
- [ ] Set database password (save securely!)
- [ ] Choose region (closest to you)
- [ ] Click "Create new project"
- [ ] Wait for provisioning (~2 minutes)

### 1.2 Apply Database Schema
- [ ] Go to Project Dashboard
- [ ] Click "SQL Editor" in sidebar
- [ ] Click "New query"
- [ ] Copy contents of `docs/architecture/DATABASE_SCHEMA.sql`
- [ ] Paste into SQL editor
- [ ] Click "Run"
- [ ] Verify success message
- [ ] Go to "Table Editor" and confirm tables exist:
  - [ ] profiles
  - [ ] projects
  - [ ] tasks

### 1.3 Get Supabase Credentials
- [ ] Go to Project Settings (gear icon)
- [ ] Click "API" in sidebar
- [ ] Copy "Project URL" (save for .env)
- [ ] Copy "anon public" key (save for .env)
- [ ] Do NOT copy service_role key (not needed)

### 1.4 Configure Authentication
- [ ] Go to Authentication → Settings
- [ ] Verify "Enable email confirmations" is OFF (for MVP)
- [ ] Set "Site URL" to `http://localhost:5173`
- [ ] Add "Redirect URLs": `http://localhost:5173/auth/callback`
- [ ] Click "Save"

## 2. OAuth Provider Setup

### 2.1 Google OAuth
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new project or select existing
- [ ] Enable Google+ API
- [ ] Go to Credentials
- [ ] Click "Create Credentials" → "OAuth client ID"
- [ ] Choose "Web application"
- [ ] Name: "Helm MVP"
- [ ] Authorized redirect URIs:
  - [ ] `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
- [ ] Click "Create"
- [ ] Copy Client ID
- [ ] Copy Client Secret
- [ ] Go to Supabase Dashboard → Authentication → Providers
- [ ] Find "Google" and enable it
- [ ] Paste Client ID and Client Secret
- [ ] Click "Save"

### 2.2 Microsoft OAuth
- [ ] Go to [Azure Portal](https://portal.azure.com)
- [ ] Go to "Azure Active Directory"
- [ ] Click "App registrations" → "New registration"
- [ ] Name: "Helm MVP"
- [ ] Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
- [ ] Redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
- [ ] Click "Register"
- [ ] Copy "Application (client) ID"
- [ ] Go to "Certificates & secrets"
- [ ] Click "New client secret"
- [ ] Add description: "Helm MVP"
- [ ] Choose expiration
- [ ] Click "Add"
- [ ] Copy the secret VALUE (not ID)
- [ ] Go to Supabase Dashboard → Authentication → Providers
- [ ] Find "Azure (Microsoft)" and enable it
- [ ] Paste Application ID and Client Secret
- [ ] Click "Save"

## 3. Frontend Setup

### 3.1 Install Dependencies
```bash
cd frontend
npm install
```
- [ ] Run command above
- [ ] Wait for installation to complete
- [ ] Verify no errors

### 3.2 Configure Environment Variables
```bash
cp .env.example .env
```
- [ ] Run command above
- [ ] Open `.env` file
- [ ] Replace `your-project-url.supabase.co` with actual Supabase URL
- [ ] Replace `your-anon-key-here` with actual anon key
- [ ] Save file

### 3.3 Start Development Server
```bash
npm run dev
```
- [ ] Run command above
- [ ] Open browser to http://localhost:5173
- [ ] Verify app loads without errors
- [ ] Check browser console for errors

## 4. Authentication Testing

### 4.1 Google OAuth Flow
- [ ] Click "Continue with Google" button
- [ ] Sign in with Google account
- [ ] Verify redirect to dashboard
- [ ] Check that email is displayed in header
- [ ] Check browser console for errors
- [ ] Verify no red error messages

### 4.2 Microsoft OAuth Flow
- [ ] Click "Sign Out"
- [ ] Click "Continue with Microsoft" button
- [ ] Sign in with Microsoft account
- [ ] Verify redirect to dashboard
- [ ] Check that email is displayed in header
- [ ] Check browser console for errors
- [ ] Verify no red error messages

### 4.3 Protected Routes
- [ ] While signed in, navigate to http://localhost:5173/dashboard
- [ ] Verify dashboard renders
- [ ] Click "Sign Out"
- [ ] Try to access http://localhost:5173/dashboard
- [ ] Verify redirect to login page

### 4.4 Session Persistence
- [ ] Sign in with any provider
- [ ] Verify dashboard loads
- [ ] Refresh the page (F5)
- [ ] Verify still signed in (no redirect to login)
- [ ] Close browser tab
- [ ] Open new tab to http://localhost:5173
- [ ] Verify still signed in

## 5. Database Verification

### 5.1 Check Profile Creation
- [ ] Sign in with new account
- [ ] Go to Supabase Dashboard → Table Editor
- [ ] Open "profiles" table
- [ ] Verify new row created with your email
- [ ] Check fields are populated correctly

### 5.2 Test RLS Policies
- [ ] Stay signed in
- [ ] Open browser DevTools → Network tab
- [ ] Navigate around the app
- [ ] Check Supabase API calls
- [ ] Verify 200 responses (not 401/403)

## 6. Final Checks

### 6.1 Code Quality
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] No console warnings (or known/acceptable)
- [ ] All files have proper imports
- [ ] No unused imports

### 6.2 User Experience
- [ ] Login page looks good
- [ ] Dashboard looks good
- [ ] Loading states work properly
- [ ] Error messages are user-friendly
- [ ] Buttons are clickable and responsive
- [ ] Layout is responsive (test mobile view)

### 6.3 Documentation
- [ ] README.md is accurate
- [ ] CURRENT_PHASE.md is updated
- [ ] DATABASE_SCHEMA.sql is documented
- [ ] All TODO comments in code are noted

## 7. Git Commit

### 7.1 Stage and Commit
```bash
git add .
git commit -m "Phase 1 complete: Authentication working"
git push origin main
```
- [ ] Stage all changes
- [ ] Commit with descriptive message
- [ ] Push to GitHub

### 7.2 Tag Release
```bash
git tag v0.1.0-phase1
git push origin v0.1.0-phase1
```
- [ ] Create version tag
- [ ] Push tag to remote

## Phase 1 Complete! 🎉

When all items above are checked, Phase 1 is complete and you're ready to move to Phase 2: Database & Basic PM Features.

## Troubleshooting

### Common Issues

**Issue**: OAuth redirect not working  
**Solution**: Check redirect URL in provider settings matches Supabase exactly

**Issue**: Environment variables not loading  
**Solution**: Restart dev server after changing .env

**Issue**: Supabase client errors  
**Solution**: Verify URL and anon key are correct in .env

**Issue**: RLS policy errors  
**Solution**: Verify schema was applied correctly, check Supabase logs

**Issue**: TypeScript errors  
**Solution**: Run `npm install` again, restart IDE

### Getting Help
- Check Supabase logs: Dashboard → Authentication → Logs
- Check browser console for errors
- Check Network tab for failed API calls
- Review [CURSOR_SETUP.md](../../CURSOR_SETUP.md) for common issues

