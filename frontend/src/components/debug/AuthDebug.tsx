import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export default function AuthDebug() {
  const { user, loading, session, organizationId } = useAuth()
  
  const testOrgIdFetch = async () => {
    console.log('Test button clicked!')
    if (!user) {
      console.log('No user available')
      alert('No user available')
      return
    }
    
    console.log('Manual test: Fetching organization ID for user:', user.id)
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()
      
      console.log('Manual test result:', { profile, error })
      
      if (error) {
        console.error('Manual test error:', error)
        alert(`Error: ${error.message}`)
      } else {
        console.log('Manual test success:', profile)
        alert(`Organization ID: ${profile?.organization_id || 'null'}`)
      }
    } catch (err) {
      console.error('Manual test exception:', err)
      alert(`Exception: ${err}`)
    }
  }
  
  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Supabase Configured: {isSupabaseConfigured ? '✅' : '❌'}</div>
        <div>Loading: {loading ? '⏳' : '✅'}</div>
        <div>User: {user ? '✅' : '❌'}</div>
        <div>Session: {session ? '✅' : '❌'}</div>
        <div>Org ID: {organizationId || 'null'}</div>
        <div>User Email: {user?.email || 'none'}</div>
        <button 
          onClick={() => {
            console.log('Button clicked!')
            testOrgIdFetch()
          }}
          className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Test Org ID Fetch
        </button>
      </div>
    </div>
  )
}
