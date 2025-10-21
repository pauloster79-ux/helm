import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface LeftNavigationProps {
  selectedView: 'overview' | 'tasks' | 'risks' | 'timeline' | 'documents'
  onViewSelect: (view: 'overview' | 'tasks' | 'risks' | 'timeline' | 'documents') => void
  hasSelectedProject: boolean
}

export default function LeftNavigation({ selectedView, onViewSelect, hasSelectedProject }: LeftNavigationProps) {
  const navigationItems = [
    {
      id: 'overview' as const,
      name: 'Overview',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'tasks' as const,
      name: 'Tasks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      badge: '12' // TODO: Get actual task count
    },
    {
      id: 'risks' as const,
      name: 'Risks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      badge: '3' // TODO: Get actual risk count
    },
    {
      id: 'timeline' as const,
      name: 'Timeline',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'documents' as const,
      name: 'Documents',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: '8' // TODO: Get actual document count
    }
  ]

  return (
    <nav className="p-4">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const isSelected = selectedView === item.id
          const isDisabled = !hasSelectedProject && item.id !== 'overview'

          return (
            <Button
              key={item.id}
              variant={isSelected ? "secondary" : "ghost"}
              size="sm"
              onClick={() => !isDisabled && onViewSelect(item.id)}
              disabled={isDisabled}
              className="w-full justify-start h-auto p-4 text-base"
            >
              <div className={`flex-shrink-0 ${
                isSelected ? 'text-gray-700' : isDisabled ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0 ml-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate text-base">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-sm">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
