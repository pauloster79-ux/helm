import { Project } from '@/types/database.types'

interface ProjectTimelineProps {
  project: Project
}

// Mock timeline data - will be replaced with real data later
const mockMilestones = [
  {
    id: '1',
    title: 'Project Kickoff',
    description: 'Initial project setup and team alignment',
    date: '2025-10-01',
    status: 'completed' as const,
    type: 'milestone' as const
  },
  {
    id: '2',
    title: 'Design Phase Complete',
    description: 'All design mockups and wireframes approved',
    date: '2025-10-15',
    status: 'in_progress' as const,
    type: 'milestone' as const
  },
  {
    id: '3',
    title: 'Development Phase',
    description: 'Core functionality development',
    date: '2025-10-20',
    status: 'upcoming' as const,
    type: 'phase' as const
  },
  {
    id: '4',
    title: 'Testing & QA',
    description: 'Quality assurance and testing phase',
    date: '2025-11-10',
    status: 'upcoming' as const,
    type: 'phase' as const
  },
  {
    id: '5',
    title: 'Project Launch',
    description: 'Final deployment and go-live',
    date: '2025-11-25',
    status: 'upcoming' as const,
    type: 'milestone' as const
  }
]

export default function ProjectTimeline({ project }: ProjectTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'upcoming':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'in_progress':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      case 'upcoming':
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
          <p className="text-gray-600 mt-1">Project milestones and phases for {project.name}</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
          + Add Milestone
        </button>
      </div>

      {/* Timeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{mockMilestones.length}</div>
          <div className="text-sm text-gray-500">Total Milestones</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">
            {mockMilestones.filter(m => m.status === 'completed').length}
          </div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">
            {mockMilestones.filter(m => m.status === 'in_progress').length}
          </div>
          <div className="text-sm text-blue-600">In Progress</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-900">
            {mockMilestones.filter(m => m.status === 'upcoming').length}
          </div>
          <div className="text-sm text-yellow-600">Upcoming</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Timeline</h3>
        <div className="space-y-6">
          {mockMilestones.map((milestone, index) => {
            const daysUntil = getDaysUntil(milestone.date)
            const isOverdue = daysUntil < 0 && milestone.status !== 'completed'
            
            return (
              <div key={milestone.id} className="flex items-start gap-4">
                {/* Timeline line and icon */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    milestone.status === 'completed' ? 'bg-green-100' :
                    milestone.status === 'in_progress' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {getStatusIcon(milestone.status)}
                  </div>
                  {index < mockMilestones.length - 1 && (
                    <div className="w-px h-16 bg-gray-200 mt-2"></div>
                  )}
                </div>

                {/* Milestone content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {milestone.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(milestone.status)}`}>
                          {milestone.status.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {milestone.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{milestone.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📅 {formatDate(milestone.date)}</span>
                        {milestone.status === 'upcoming' && (
                          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                            {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days until`}
                          </span>
                        )}
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
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
