import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  organizationId: string | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Cache to avoid redundant profile fetches (survives re-renders)
  const orgIdCacheRef = useRef<Map<string, string>>(new Map())
  
  // Track pending organization fetches to prevent duplicates
  const pendingOrgFetchRef = useRef<Map<string, Promise<void>>>(new Map())

  // Helper function to fetch organization with caching and deduplication
  const fetchOrganizationId = useCallback(async (userId: string) => {
    console.log('Fetching organization ID for user:', userId)
    
    // Check cache first
    if (orgIdCacheRef.current.has(userId)) {
      const cachedOrgId = orgIdCacheRef.current.get(userId)!
      console.log('Using cached org ID:', cachedOrgId)
      setOrganizationId(cachedOrgId)
      return
    }

    // Check if there's already a pending fetch for this user
    const pendingFetch = pendingOrgFetchRef.current.get(userId)
    if (pendingFetch) {
      console.log('Waiting for existing fetch to complete...')
      return pendingFetch
    }

    // Create new fetch promise
    const fetchPromise = (async () => {
      try {
        console.log('Querying user_profiles table...')
        
        // Add timeout to prevent hanging
        const queryPromise = supabase
          .from('user_profiles')
          .select('organization_id')
          .eq('user_id', userId)
          .single()
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Organization ID fetch timeout')), 5000)
        )
        
        const { data: profile, error } = await Promise.race([
          queryPromise,
          timeoutPromise
        ]) as any
        
        console.log('User profile query result:', { profile, error })
        
        if (error) {
          console.error('Error fetching user profile:', error)
          if (error.code === 'PGRST116') {
            console.warn('No user profile found - user may need to be created in user_profiles table')
          }
          setOrganizationId(null)
        } else if (profile?.organization_id) {
          // Cache the result
          console.log('Setting organization ID:', profile.organization_id)
          orgIdCacheRef.current.set(userId, profile.organization_id)
          setOrganizationId(profile.organization_id)
        } else {
          console.warn('Profile found but no organization_id')
          setOrganizationId(null)
        }
      } catch (error) {
        console.error('Error fetching organization:', error)
        setOrganizationId(null)
      } finally {
        // Remove from pending fetches
        pendingOrgFetchRef.current.delete(userId)
      }
    })()

    // Store pending fetch
    pendingOrgFetchRef.current.set(userId, fetchPromise)
    
    return fetchPromise
  }, [])

  useEffect(() => {
    let mounted = true
    
    // Failsafe timeout to prevent infinite loading - increased to 10 seconds
    const failsafeTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - forcing loading to false')
        setLoading(false)
        // Don't clear user/session on timeout - let the session load naturally
      }
    }, 10000) // 10 second failsafe
    
    // Get the initial session
    const initAuth = async () => {
      try {
        // Check if Supabase is configured first
        if (!isSupabaseConfigured) {
          console.warn('Supabase not configured - skipping auth initialization')
          if (mounted) {
            setLoading(false)
            setUser(null)
            setSession(null)
            setOrganizationId(null)
          }
          return
        }

        console.log('Attempting to get session from Supabase...')
        
        // Get session without aggressive timeout - let it load naturally
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('Session result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          error: error?.message 
        })
        
        if (!mounted) return
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        // Fetch organization ID if user is authenticated
        if (session?.user) {
          console.log('User authenticated, fetching organization ID for:', session.user.id)
          // Fetch org ID in background without blocking
          fetchOrganizationId(session.user.id).catch(error => {
            console.error('Failed to fetch organization ID:', error)
            setOrganizationId(null)
          })
        } else {
          console.log('No user session found')
          setOrganizationId(null)
        }
        
        // Always set loading to false after session is processed
        if (mounted) {
          clearTimeout(failsafeTimeout)
          setLoading(false)
        }
      } catch (error) {
        if (!mounted) return
        console.error('Failed to initialize auth:', error)
        clearTimeout(failsafeTimeout)
        setLoading(false)
      }
    }
    
    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      console.log('Auth state changed:', event)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      // Only fetch organization on SIGNED_IN event, not on every token refresh
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchOrganizationId(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setOrganizationId(null)
        orgIdCacheRef.current.clear()
        pendingOrgFetchRef.current.clear()
      }
      
      setLoading(false)
    })

    return () => {
      mounted = false
      clearTimeout(failsafeTimeout)
      subscription.unsubscribe()
    }
  }, [fetchOrganizationId]) // Add fetchOrganizationId as dependency

  const signInWithGoogle = async () => {
    // TODO: Phase 1 - Implement Google OAuth sign-in
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signInWithMicrosoft = async () => {
    // TODO: Phase 1 - Implement Microsoft OAuth sign-in
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Microsoft:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log('Sign out initiated...')
    try {
      // Clear state first to provide immediate feedback
      setUser(null)
      setSession(null)
      setOrganizationId(null)
      orgIdCacheRef.current.clear()
      pendingOrgFetchRef.current.clear()
      
      // Sign out from Supabase with global scope to revoke all sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      if (error) {
        console.error('Supabase sign out error:', error)
        // Continue with redirect even if Supabase fails
      }
      
      // Clear any remaining localStorage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('sb-auth-token')
        // Clear any cached organization data
        sessionStorage.removeItem('org_id')
      }
      
      console.log('Sign out complete, redirecting...')
      // Force redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      // Still redirect even if there's an error
      window.location.href = '/login'
    }
  }

  const value = {
    user,
    session,
    organizationId,
    loading,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

