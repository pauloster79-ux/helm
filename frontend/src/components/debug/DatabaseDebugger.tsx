import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DatabaseDebuggerProps {
  projectId: string
}

interface DebugInfo {
  user: string
  projectId: string
  timestamp: string
  basicQuery: {
    success: boolean
    error?: string
    dataCount: number
    sampleData?: any
  }
  enhancedQuery: {
    success: boolean
    error?: string
    dataCount: number
  }
  connectionTest: any
  generalError?: string
}

export default function DatabaseDebugger({ projectId }: DatabaseDebuggerProps) {
  const { user } = useAuth()
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    runDiagnostics()
  }, [user, projectId])

  const runDiagnostics = async () => {
    if (!user || !projectId) {
      setLoading(false)
      return
    }

    const info: DebugInfo = {
      user: user.id,
      projectId,
      timestamp: new Date().toLocaleTimeString(),
      basicQuery: { success: false, dataCount: 0 },
      enhancedQuery: { success: false, dataCount: 0 },
      connectionTest: null
    }

    try {
      // Test 1: Basic connection
      const { data: connectionTest } = await supabase
        .from('tasks')
        .select('count', { count: 'exact', head: true })
        .eq('project_id', projectId)
      
      info.connectionTest = connectionTest

      // Test 2: Try basic query
      const { data: basicQuery, error: basicError } = await supabase
        .from('tasks')
        .select('id,project_id,user_id,title,description,status,priority,estimated_hours,created_at,updated_at')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .limit(5)

      info.basicQuery = {
        success: !basicError,
        error: basicError?.message,
        dataCount: basicQuery?.length || 0,
        sampleData: basicQuery?.[0] || null
      }

      // Test 3: Try enhanced query (with new columns)
      const { data: enhancedQuery, error: enhancedError } = await supabase
        .from('tasks')
        .select('id,project_id,user_id,title,description,status,priority,estimated_hours,progress_percentage,parent_task_id,owner_id,start_date,end_date,completed_at,created_at,updated_at,deleted_at')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .limit(5)

      info.enhancedQuery = {
        success: !enhancedError,
        error: enhancedError?.message,
        dataCount: enhancedQuery?.length || 0
      }

    } catch (error) {
      info.generalError = error instanceof Error ? error.message : String(error)
    }

    setDebugInfo(info)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="text-xs"
        >
          🔍 Checking Database...
        </Button>
      </div>
    )
  }

  if (!isExpanded) {
    const hasErrors = debugInfo?.basicQuery.success === false || debugInfo?.generalError
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className={`text-xs ${hasErrors ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}
        >
          {hasErrors ? '🔴 Database Issues' : '✅ Database OK'}
        </Button>
      </div>
    )
  }

  return (
    <Card className="mb-4 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Database Debug</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-xs"
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-1">User ID</div>
            <code className="text-xs bg-gray-100 px-1 rounded">
              {debugInfo?.user.slice(0, 8)}...
            </code>
          </div>
          
          <div>
            <div className="font-medium mb-1">Project ID</div>
            <code className="text-xs bg-gray-100 px-1 rounded">
              {debugInfo?.projectId.slice(0, 8)}...
            </code>
          </div>
        </div>

        {debugInfo?.basicQuery && (
          <div className="p-3 bg-white rounded border">
            <h4 className="font-medium text-green-700 mb-2">✅ Basic Query Test</h4>
            <div className="space-y-1">
              <div><strong>Success:</strong> {debugInfo.basicQuery.success ? 'Yes' : 'No'}</div>
              {debugInfo.basicQuery.error && (
                <div><strong>Error:</strong> <span className="text-red-600">{debugInfo.basicQuery.error}</span></div>
              )}
              <div><strong>Data Count:</strong> {debugInfo.basicQuery.dataCount}</div>
              {debugInfo.basicQuery.sampleData && (
                <div><strong>Sample:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{debugInfo.basicQuery.sampleData.title}</code></div>
              )}
            </div>
          </div>
        )}

        {debugInfo?.enhancedQuery && (
          <div className="p-3 bg-white rounded border">
            <h4 className="font-medium text-yellow-700 mb-2">⚠️ Enhanced Query Test</h4>
            <div className="space-y-1">
              <div><strong>Success:</strong> {debugInfo.enhancedQuery.success ? 'Yes' : 'No'}</div>
              {debugInfo.enhancedQuery.error && (
                <div><strong>Error:</strong> <span className="text-red-600">{debugInfo.enhancedQuery.error}</span></div>
              )}
              <div><strong>Data Count:</strong> {debugInfo.enhancedQuery.dataCount}</div>
            </div>
          </div>
        )}

        {debugInfo?.generalError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="font-medium text-red-700 mb-2">❌ General Error</h4>
            <div className="text-red-600 text-xs">{debugInfo.generalError}</div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-700 mb-2">💡 Next Steps</h4>
          <ul className="text-blue-600 space-y-1 text-xs">
            <li>• If basic query fails: Check database connection</li>
            <li>• If enhanced query fails: Apply schema update</li>
            <li>• If both succeed: Check browser console</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={runDiagnostics}
            className="text-xs"
          >
            🔄 Retry Tests
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
