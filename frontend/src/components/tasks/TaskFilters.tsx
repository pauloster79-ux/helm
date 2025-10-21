import { useState } from 'react'
import type { TaskFilters } from '@/types/database.types'
import { Input } from '@/components/ui/input'

interface TaskFiltersProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
}

export default function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof TaskFilters]
    return value !== undefined && value !== null && value !== '' && 
           (Array.isArray(value) ? value.length > 0 : true)
  })

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filter Content */}
      {showFilters && (
        <div className="space-y-4">
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          id="search"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search tasks..."
        />
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="space-y-2">
            {[
              { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800' },
              { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
              { value: 'review', label: 'Review', color: 'bg-yellow-100 text-yellow-800' },
              { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800' }
            ].map((status) => (
              <label key={status.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status.value as any) || false}
                  onChange={(e) => {
                    const currentStatuses = filters.status || []
                    if (e.target.checked) {
                      handleFilterChange('status', [...currentStatuses, status.value])
                    } else {
                      handleFilterChange('status', currentStatuses.filter(s => s !== status.value))
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <div className="space-y-2">
            {[
              { value: 'low', label: 'Low', color: 'text-green-600' },
              { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
              { value: 'high', label: 'High', color: 'text-red-600' }
            ].map((priority) => (
              <label key={priority.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.priority?.includes(priority.value as any) || false}
                  onChange={(e) => {
                    const currentPriorities = filters.priority || []
                    if (e.target.checked) {
                      handleFilterChange('priority', [...currentPriorities, priority.value])
                    } else {
                      handleFilterChange('priority', currentPriorities.filter(p => p !== priority.value))
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className={`ml-2 text-sm font-medium ${priority.color}`}>
                  {priority.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          {/* Progress Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="progress_min" className="block text-xs text-gray-600 mb-1">
                  Min Progress (%)
                </label>
                <input
                  type="number"
                  id="progress_min"
                  value={filters.progress_min || ''}
                  onChange={(e) => handleFilterChange('progress_min', e.target.value ? Number(e.target.value) : undefined)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="progress_max" className="block text-xs text-gray-600 mb-1">
                  Max Progress (%)
                </label>
                <input
                  type="number"
                  id="progress_max"
                  value={filters.progress_max || ''}
                  onChange={(e) => handleFilterChange('progress_max', e.target.value ? Number(e.target.value) : undefined)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Start Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date_from" className="block text-xs text-gray-600 mb-1">
                  From
                </label>
                <Input
                  type="date"
                  id="start_date_from"
                  value={filters.start_date_from || ''}
                  onChange={(e) => handleFilterChange('start_date_from', e.target.value || undefined)}
                />
              </div>
              <div>
                <label htmlFor="start_date_to" className="block text-xs text-gray-600 mb-1">
                  To
                </label>
                <Input
                  type="date"
                  id="start_date_to"
                  value={filters.start_date_to || ''}
                  onChange={(e) => handleFilterChange('start_date_to', e.target.value || undefined)}
                />
              </div>
            </div>
          </div>

          {/* End Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="end_date_from" className="block text-xs text-gray-600 mb-1">
                  From
                </label>
                <Input
                  type="date"
                  id="end_date_from"
                  value={filters.end_date_from || ''}
                  onChange={(e) => handleFilterChange('end_date_from', e.target.value || undefined)}
                />
              </div>
              <div>
                <label htmlFor="end_date_to" className="block text-xs text-gray-600 mb-1">
                  To
                </label>
                <Input
                  type="date"
                  id="end_date_to"
                  value={filters.end_date_to || ''}
                  onChange={(e) => handleFilterChange('end_date_to', e.target.value || undefined)}
                />
              </div>
            </div>
          </div>

          {/* Parent Task Filter */}
          <div>
            <label htmlFor="parent_task_id" className="block text-sm font-medium text-gray-700 mb-1">
              Parent Task
            </label>
            <select
              id="parent_task_id"
              value={filters.parent_task_id === null ? 'none' : (filters.parent_task_id || '')}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'none') {
                  handleFilterChange('parent_task_id', null)
                } else if (value === '') {
                  handleFilterChange('parent_task_id', undefined)
                } else {
                  handleFilterChange('parent_task_id', value)
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All tasks</option>
              <option value="none">Root tasks only</option>
              {/* Note: In a real implementation, you'd populate this with actual parent tasks */}
            </select>
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
        </div>
      )}
    </div>
  )
}
