import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Export a flag to check if credentials are configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
  console.error('Create a .env file in the frontend directory with:')
  console.error('  VITE_SUPABASE_URL=https://your-project.supabase.co')
  console.error('  VITE_SUPABASE_ANON_KEY=your-anon-key')
}

// Test the Supabase connection in development only - DISABLED for performance
// if (import.meta.env.DEV && isSupabaseConfigured) {
//   const testConnection = async () => {
//     try {
//       const response = await fetch(`${supabaseUrl}/rest/v1/`, {
//         method: 'HEAD',
//         headers: {
//           'apikey': supabaseAnonKey,
//           'Authorization': `Bearer ${supabaseAnonKey}`
//         }
//       })
//       
//       if (!response.ok) {
//         console.warn(`Supabase connection test failed: ${response.status} ${response.statusText}`)
//       } else {
//         console.log('✅ Supabase connection test successful')
//       }
//     } catch (error) {
//       console.warn('Supabase connection test failed:', error)
//     }
//   }
//   
//   // Run test in background without blocking
//   testConnection()
// }

// Create a single supabase client for interacting with your database
// Use dummy values if not configured to prevent errors
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Increase session duration to 30 days (default is 7 days)
      // This keeps users logged in for a month
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'supabase.auth.token',
      // Enable automatic token refresh
      flowType: 'pkce',
    },
  }
)

