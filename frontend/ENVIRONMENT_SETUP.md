# 🔧 Environment Setup Guide

## The Issue
You're seeing "Failed to fetch tasks: TypeError: Failed to fetch" because your Supabase environment variables are not configured.

## Quick Fix

### Step 1: Create Environment File
1. **In the `frontend` folder**, create a new file called `.env`
2. **Copy the contents from `env.example`** into the new `.env` file

### Step 2: Get Your Supabase Credentials
1. **Go to** [https://app.supabase.com](https://app.supabase.com)
2. **Select your Helm project**
3. **Go to Settings** → **API**
4. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon/Public Key** (long string starting with `eyJ...`)

### Step 3: Update Your .env File
Replace the placeholder values in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 4: Restart the Dev Server
1. **Stop the dev server** (Ctrl+C in terminal)
2. **Restart it:**
   ```bash
   cd frontend
   npm run dev
   ```
3. **Refresh your browser** (Ctrl+F5)

## Verification

After setup, you should see:
- ✅ **No more "Failed to fetch" errors**
- ✅ **Tasks load quickly** (<500ms)
- ✅ **Database debug panel shows green checkmarks**

## Common Issues

### Issue 1: Still Getting Errors
- **Check your `.env` file** is in the `frontend` folder (not root)
- **Verify the URL format** - should start with `https://` and end with `.supabase.co`
- **Check the key format** - should be a long string starting with `eyJ`

### Issue 2: Environment Variables Not Loading
- **Restart the dev server** after creating `.env`
- **Check file name** - must be exactly `.env` (not `.env.txt` or `.env.local`)
- **Check location** - must be in the `frontend` folder

### Issue 3: Wrong Supabase Project
- **Double-check the project URL** matches your actual Supabase project
- **Make sure you're using the right project** (not a different one)

## Example .env File

```env
# Replace with your actual values from Supabase Dashboard
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoyMDE1NTc1OTk5fQ.example-signature
```

## Security Note

- ✅ **Safe to commit** `.env.example` (contains no real credentials)
- ❌ **Never commit** `.env` (contains real credentials)
- ✅ **The `.env` file is already in `.gitignore`**

## Still Having Issues?

1. **Check the browser console** for specific error messages
2. **Look at the debug panel** for database connection status
3. **Verify your Supabase project is active** (not paused)
4. **Check your internet connection**

---

**Once you set up the `.env` file, the "Failed to fetch" error should disappear and tasks should load much faster!** 🚀
