import { useState } from 'react'

export type ViewMode = 'cards' | 'table'

interface ViewSelectorProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
  projectCount: number
}

export default function ViewSelector({ currentView, onViewChange, projectCount }: ViewSelectorProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium text-gray-900">
          {projectCount} Project{projectCount !== 1 ? 's' : ''}
        </h2>
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('cards')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'cards'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Cards
          </button>
          
          <button
            onClick={() => onViewChange('table')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
            </svg>
            Table
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        {currentView === 'cards' ? 'Card view' : 'Table view'}
      </div>
    </div>
  )
}
