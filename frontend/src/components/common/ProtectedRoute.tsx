import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'
import SetupRequired from '@/components/auth/SetupRequired'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  // Show setup required if Supabase is not configured
  if (!isSupabaseConfigured) {
    return <SetupRequired />
  }

  // TODO: Phase 1 - Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // TODO: Phase 1 - Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

