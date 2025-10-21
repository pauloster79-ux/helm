# Session Management - Quick Reference

## What Changed

### Before
- ❌ Sessions would "disappear" after closing browser
- ❌ Had to sign out and back in to see projects
- ❌ Aggressive timeouts cutting off session restoration

### After
- ✅ Sessions persist for 30 days
- ✅ Projects load immediately when you return
- ✅ No need to re-login after closing browser
- ✅ Proper session restoration

## How It Works Now

### Session Persistence
- **Duration**: 30 days
- **Storage**: localStorage (survives browser restarts)
- **Refresh**: Automatic (before expiry)
- **Security**: Tokens encrypted by Supabase

### User Flow

#### Browser Restart
1. Close browser
2. Reopen browser
3. Navigate to Helm
4. **You're still logged in!** ✨
5. Projects load automatically

#### Explicit Sign-Out
1. Click "Sign Out" button
2. Session cleared from localStorage
3. Redirected to login page
4. Must sign in again to access

## Best Practices

### For Users
- ✅ Close browser anytime - session persists
- ✅ Sign out when using shared computers
- ✅ Projects sync automatically
- ⚠️ Don't use "Sign Out" unless you want to log out

### For Developers
- ✅ Sessions auto-restore on app load
- ✅ No manual session management needed
- ✅ Token refresh is automatic
- ✅ Supabase handles all security

## Configuration

### Session Duration
```typescript
// 30 days (Supabase default)
// Configured in: frontend/src/lib/supabase.ts
```

### Storage Location
```typescript
// localStorage (browser-specific)
// Key: 'supabase.auth.token'
```

### Auto-Refresh
```typescript
// Enabled by default
// Refreshes before token expires
```

## Troubleshooting

### Projects Not Loading
1. Check browser console for errors
2. Look for "Session result" log
3. Verify user is authenticated
4. Check network tab for API calls

### Session Lost
1. Check localStorage for 'supabase.auth.token'
2. Verify Supabase configuration
3. Check browser console for errors
4. Try signing out and back in

### Need to Clear Session
1. Click "Sign Out" button
2. Or manually clear localStorage:
   ```javascript
   localStorage.removeItem('supabase.auth.token')
   ```

## Security Notes

### What's Secure
- ✅ Tokens are encrypted
- ✅ Validated on every request
- ✅ PKCE flow for OAuth
- ✅ HTTPS required for production

### What to Watch
- ⚠️ Don't share computers without signing out
- ⚠️ Don't store sensitive data in localStorage
- ⚠️ Use HTTPS in production
- ⚠️ Rotate API keys regularly

## Testing Checklist

- [ ] Sign in to Helm
- [ ] Create a project
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Navigate to Helm
- [ ] Verify: Still logged in
- [ ] Verify: Projects are visible
- [ ] Sign out explicitly
- [ ] Verify: Redirected to login
- [ ] Sign in again
- [ ] Verify: Projects still there

## Console Logs to Watch

### Successful Session Restore
```
Attempting to get session from Supabase...
Session result: { hasSession: true, hasUser: true }
User authenticated, fetching organization ID for: <userId>
```

### Sign Out
```
Sign out initiated...
Sign out complete, redirecting...
```

### Auth State Changes
```
Auth state changed: SIGNED_IN
Auth state changed: TOKEN_REFRESHED
Auth state changed: SIGNED_OUT
```

## Quick Commands

### Check Current Session
```javascript
// In browser console
localStorage.getItem('supabase.auth.token')
```

### Clear Session Manually
```javascript
// In browser console
localStorage.removeItem('supabase.auth.token')
localStorage.removeItem('sb-auth-token')
location.reload()
```

### Check Supabase Config
```javascript
// In browser console
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Review SESSION_MANAGEMENT_FIX.md for details
3. Check Supabase dashboard for auth logs
4. Verify environment variables are set

## Related Files

- `frontend/src/lib/supabase.ts` - Supabase client config
- `frontend/src/contexts/AuthContext.tsx` - Auth logic
- `frontend/src/hooks/useProjects.ts` - Projects loading
- `SESSION_MANAGEMENT_FIX.md` - Detailed documentation

