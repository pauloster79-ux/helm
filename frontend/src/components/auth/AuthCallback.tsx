import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    console.log('AuthCallback mounted, setting up auth listener...')
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthCallback: Auth state changed:', event)
        
        if (event === 'SIGNED_IN' && session) {
          console.log('AuthCallback: User signed in, redirecting...')
          setRedirecting(true)
          
          // Small delay to ensure state is updated
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 300)
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthCallback: User signed out, redirecting to login...')
          setRedirecting(true)
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 300)
        }
      }
    )

    // Also check for existing session immediately
    const checkSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('AuthCallback: Session error:', sessionError)
          setError(sessionError.message)
          setTimeout(() => navigate('/login', { replace: true }), 2000)
          return
        }

        if (data.session) {
          console.log('AuthCallback: Session exists, redirecting...')
          setRedirecting(true)
          setTimeout(() => navigate('/', { replace: true }), 300)
        } else {
          console.log('AuthCallback: No session, waiting for auth state change...')
        }
      } catch (err) {
        console.error('AuthCallback: Error checking session:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setTimeout(() => navigate('/login', { replace: true }), 2000)
      }
    }

    checkSession()

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthCallback unmounting, cleaning up...')
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">
          {error ? `Error: ${error}` : redirecting ? 'Redirecting...' : 'Completing sign in...'}
        </p>
        {error && (
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        )}
      </div>
    </div>
  )
}

