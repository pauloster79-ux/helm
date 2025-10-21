import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TaskDebuggerProps {
  projectId: string
}

interface DebugInfo {
  aiServiceStatus: 'connected' | 'disconnected' | 'checking'
  lastValidation?: {
    timestamp: string
    field: string
    response: any
  }
  errorCount: number
  proposalCount: number
}

export default function TaskDebugger({ projectId }: TaskDebuggerProps) {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    aiServiceStatus: 'checking',
    errorCount: 0,
    proposalCount: 0
  })
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    checkAIServiceStatus()
  }, [])

  const checkAIServiceStatus = async () => {
    try {
      const response = await fetch('http://localhost:8001/health')
      if (response.ok) {
        await response.json()
        setDebugInfo(prev => ({
          ...prev,
          aiServiceStatus: 'connected'
        }))
      } else {
        setDebugInfo(prev => ({
          ...prev,
          aiServiceStatus: 'disconnected'
        }))
      }
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        aiServiceStatus: 'disconnected'
      }))
    }
  }

  const testAIValidation = async () => {
    try {
      const response = await fetch('http://localhost:8001/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          component_type: 'task',
          component_data: {
            title: 'Build the wall between the house and the road',
            description: 'Throw the egg at the lady'
          },
          validation_scope: 'selective',
          ai_provider: 'anthropic',
          ai_model: 'claude-3-haiku-20240307'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setDebugInfo(prev => ({
          ...prev,
          lastValidation: {
            timestamp: new Date().toLocaleTimeString(),
            field: 'title-description',
            response: data
          },
          proposalCount: prev.proposalCount + data.issues?.length || 0
        }))
      }
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1
      }))
    }
  }

  if (!isExpanded) {
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="text-xs"
        >
          🔧 Debug AI Integration
        </Button>
      </div>
    )
  }

  return (
    <Card className="mb-4 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">AI Integration Debug</CardTitle>
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
            <div className="font-medium mb-1">AI Service Status</div>
            <Badge 
              variant={debugInfo.aiServiceStatus === 'connected' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {debugInfo.aiServiceStatus === 'connected' && '🟢 Connected'}
              {debugInfo.aiServiceStatus === 'disconnected' && '🔴 Disconnected'}
              {debugInfo.aiServiceStatus === 'checking' && '🟡 Checking...'}
            </Badge>
          </div>
          
          <div>
            <div className="font-medium mb-1">Project ID</div>
            <code className="text-xs bg-gray-100 px-1 rounded">
              {projectId.slice(0, 8)}...
            </code>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-1">Proposals Generated</div>
            <span className="text-lg font-bold text-blue-600">
              {debugInfo.proposalCount}
            </span>
          </div>
          
          <div>
            <div className="font-medium mb-1">Errors</div>
            <span className="text-lg font-bold text-red-600">
              {debugInfo.errorCount}
            </span>
          </div>
        </div>

        {debugInfo.lastValidation && (
          <div>
            <div className="font-medium mb-1">Last Validation</div>
            <div className="text-xs text-gray-600">
              {debugInfo.lastValidation.timestamp} - {debugInfo.lastValidation.field}
            </div>
            {debugInfo.lastValidation.response.issues?.length > 0 && (
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  {debugInfo.lastValidation.response.issues.length} issues found
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkAIServiceStatus}
            className="text-xs"
          >
            Check Status
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={testAIValidation}
            className="text-xs"
          >
            Test Validation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}