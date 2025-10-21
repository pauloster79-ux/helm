import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function QuickDiagnostic() {
  const { user } = useAuth()
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runQuickCheck = async () => {
    setLoading(true)
    const results: any = {}

    try {
      // Check environment
      results.env = {
        url: import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing',
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'
      }

      // Check auth
      results.auth = {
        user: user ? `✓ ${user.email}` : '✗ Not logged in'
      }

      // Quick projects test
      if (user) {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, user_id')
          .eq('user_id', user.id)
          .limit(5)

        results.projects = {
          count: data?.length || 0,
          error: error?.message || null,
          sample: data?.slice(0, 2) || []
        }
      }

    } catch (err: any) {
      results.error = err.message
    }

    setStatus(results)
    setLoading(false)
  }

  useEffect(() => {
    runQuickCheck()
  }, [user])

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Quick Diagnostic</h1>
      
      <Button onClick={runQuickCheck} disabled={loading} className="mb-4">
        {loading ? 'Checking...' : 'Refresh Check'}
      </Button>

      {status && (
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div>
            <h3 className="font-semibold">Environment:</h3>
            <div className="text-sm font-mono">
              <div>URL: {status.env?.url}</div>
              <div>Key: {status.env?.key}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Authentication:</h3>
            <div className="text-sm">{status.auth?.user}</div>
          </div>

          <div>
            <h3 className="font-semibold">Projects:</h3>
            <div className="text-sm">
              <div>Count: {status.projects?.count || 0}</div>
              {status.projects?.error && (
                <div className="text-red-600">Error: {status.projects.error}</div>
              )}
              {status.projects?.sample?.length > 0 && (
                <div>
                  Sample: {status.projects.sample.map((p: any) => p.name).join(', ')}
                </div>
              )}
            </div>
          </div>

          {status.error && (
            <div className="text-red-600">
              <strong>Error:</strong> {status.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
