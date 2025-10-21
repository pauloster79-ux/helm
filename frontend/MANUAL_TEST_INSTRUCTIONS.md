# 🧪 Manual Testing Instructions

## Since the test button isn't working, let's test manually:

### **Method 1: Browser Console Test**

1. **Open browser console** (F12)
2. **Paste this code** and press Enter:

```javascript
// Test organization ID fetch
async function testOrgId() {
  const { createClient } = await import('https://unpkg.com/@supabase/supabase-js@2');
  
  const supabaseUrl = 'https://lkkgwwtrgqxpmqzmlpas.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxra2d3d3RyZ3F4cG1xem1scGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NzUyMTIsImV4cCI6MjA3NTI1MTIxMn0.idfXaHLrstmm8Azxet1Fw1QuTt14KA0G3sdMYgHTaZ8';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user);
  
  if (user) {
    // Test user_profiles access
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();
    
    console.log('Profile result:', { profile, error });
    
    if (error) {
      console.error('Error details:', error);
      alert(`Error: ${error.message}`);
    } else {
      console.log('Success! Organization ID:', profile?.organization_id);
      alert(`Organization ID: ${profile?.organization_id || 'null'}`);
    }
  } else {
    console.log('No user found');
    alert('No user found');
  }
}

testOrgId();
```

### **Method 2: Direct Database Query**

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run this query:**

```sql
-- Check current authenticated user
SELECT auth.uid() as current_user_id, auth.email() as current_email;

-- Check user profile access
SELECT 
  up.id,
  up.user_id,
  up.organization_id,
  au.email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'pauloster79@gmail.com';

-- Test if RLS is blocking
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
SELECT 
  up.id,
  up.user_id,
  up.organization_id,
  au.email
FROM user_profiles up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'pauloster79@gmail.com';
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### **Method 3: Check Console Logs**

1. **Open browser console** (F12)
2. **Refresh the page**
3. **Look for these logs:**
   - "User authenticated, fetching organization ID for: [user-id]"
   - "Fetching organization ID for user: [user-id]"
   - "Querying user_profiles table..."
   - "User profile query result: ..."

---

## 🎯 **What to Report:**

After running any of these tests, tell me:

1. **What the console shows** (any logs or errors)
2. **What the alert shows** (if using Method 1)
3. **What the SQL results show** (if using Method 2)

This will help identify exactly what's blocking the organization ID fetch!
