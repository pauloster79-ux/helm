import { Project } from '@/types/database.types'

interface ProjectRisksProps {
  project: Project
}

// Mock risk data - will be replaced with real data later
const mockRisks = [
  {
    id: '1',
    title: 'Budget overrun',
    description: 'Risk of exceeding the allocated budget due to scope creep',
    severity: 'high' as const,
    probability: 'medium' as const,
    impact: 'high' as const,
    status: 'open' as const,
    created_at: '2025-10-06T10:00:00Z'
  },
  {
    id: '2',
    title: 'Timeline delays',
    description: 'Potential delays due to external dependencies',
    severity: 'medium' as const,
    probability: 'high' as const,
    impact: 'medium' as const,
    status: 'monitoring' as const,
    created_at: '2025-10-06T11:00:00Z'
  },
  {
    id: '3',
    title: 'Resource availability',
    description: 'Key team members may become unavailable',
    severity: 'low' as const,
    probability: 'low' as const,
    impact: 'high' as const,
    status: 'closed' as const,
    created_at: '2025-10-06T12:00:00Z'
  }
]

export default function ProjectRisks({ project }: ProjectRisksProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risks</h1>
          <p className="text-gray-600 mt-1">Identify and track risks for {project.name}</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
          + Add Risk
        </button>
      </div>

      {/* Risk Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{mockRisks.length}</div>
          <div className="text-sm text-gray-500">Total Risks</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-900">
            {mockRisks.filter(r => r.severity === 'high').length}
          </div>
          <div className="text-sm text-red-600">High Severity</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-900">
            {mockRisks.filter(r => r.severity === 'medium').length}
          </div>
          <div className="text-sm text-yellow-600">Medium Severity</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">
            {mockRisks.filter(r => r.status === 'closed').length}
          </div>
          <div className="text-sm text-green-600">Resolved</div>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Matrix</h3>
        <div className="grid grid-cols-4 gap-4">
          {/* Matrix headers */}
          <div></div>
          <div className="text-center text-sm font-medium text-gray-500">Low Impact</div>
          <div className="text-center text-sm font-medium text-gray-500">Medium Impact</div>
          <div className="text-center text-sm font-medium text-gray-500">High Impact</div>
          
          {/* High Probability */}
          <div className="text-sm font-medium text-gray-500 flex items-center">High Probability</div>
          <div className="h-16 bg-yellow-100 border border-yellow-200 rounded flex items-center justify-center">
            <span className="text-xs text-yellow-800">Medium</span>
          </div>
          <div className="h-16 bg-red-100 border border-red-200 rounded flex items-center justify-center">
            <span className="text-xs text-red-800">High</span>
          </div>
          <div className="h-16 bg-red-100 border border-red-200 rounded flex items-center justify-center">
            <span className="text-xs text-red-800">Critical</span>
          </div>
          
          {/* Medium Probability */}
          <div className="text-sm font-medium text-gray-500 flex items-center">Medium Probability</div>
          <div className="h-16 bg-green-100 border border-green-200 rounded flex items-center justify-center">
            <span className="text-xs text-green-800">Low</span>
          </div>
          <div className="h-16 bg-yellow-100 border border-yellow-200 rounded flex items-center justify-center">
            <span className="text-xs text-yellow-800">Medium</span>
          </div>
          <div className="h-16 bg-red-100 border border-red-200 rounded flex items-center justify-center">
            <span className="text-xs text-red-800">High</span>
          </div>
          
          {/* Low Probability */}
          <div className="text-sm font-medium text-gray-500 flex items-center">Low Probability</div>
          <div className="h-16 bg-green-100 border border-green-200 rounded flex items-center justify-center">
            <span className="text-xs text-green-800">Low</span>
          </div>
          <div className="h-16 bg-green-100 border border-green-200 rounded flex items-center justify-center">
            <span className="text-xs text-green-800">Low</span>
          </div>
          <div className="h-16 bg-yellow-100 border border-yellow-200 rounded flex items-center justify-center">
            <span className="text-xs text-yellow-800">Medium</span>
          </div>
        </div>
      </div>

      {/* Risks List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Risks</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockRisks.map((risk) => (
            <div key={risk.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {risk.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(risk.severity)}`}>
                      {risk.severity} severity
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(risk.status)}`}>
                      {risk.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Created {formatDate(risk.created_at)}</span>
                    <span>Probability: {risk.probability}</span>
                    <span>Impact: {risk.impact}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
