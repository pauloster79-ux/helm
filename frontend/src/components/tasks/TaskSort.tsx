import type { TaskSortOptions } from '@/types/database.types'

interface TaskSortProps {
  sort: TaskSortOptions
  onSortChange: (sort: TaskSortOptions) => void
}

export default function TaskSort({ sort, onSortChange }: TaskSortProps) {
  const sortFields = [
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'progress_percentage', label: 'Progress' },
    { value: 'start_date', label: 'Start Date' },
    { value: 'end_date', label: 'End Date' },
    { value: 'created_at', label: 'Created Date' },
    { value: 'updated_at', label: 'Updated Date' }
  ]

  const sortDirections = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ]

  const handleFieldChange = (field: string) => {
    onSortChange({
      ...sort,
      field: field as TaskSortOptions['field']
    })
  }

  const handleDirectionChange = (direction: string) => {
    onSortChange({
      ...sort,
      direction: direction as TaskSortOptions['direction']
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          value={sort.field}
          onChange={(e) => handleFieldChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {sortFields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Direction
        </label>
        <select
          value={sort.direction}
          onChange={(e) => handleDirectionChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {sortDirections.map((direction) => (
            <option key={direction.value} value={direction.value}>
              {direction.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Sort Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Sort
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSortChange({ field: 'created_at', direction: 'desc' })}
            className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
              sort.field === 'created_at' && sort.direction === 'desc'
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Newest
          </button>
          <button
            type="button"
            onClick={() => onSortChange({ field: 'created_at', direction: 'asc' })}
            className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
              sort.field === 'created_at' && sort.direction === 'asc'
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Oldest
          </button>
          <button
            type="button"
            onClick={() => onSortChange({ field: 'end_date', direction: 'asc' })}
            className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
              sort.field === 'end_date' && sort.direction === 'asc'
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Ending Soon
          </button>
          <button
            type="button"
            onClick={() => onSortChange({ field: 'progress_percentage', direction: 'desc' })}
            className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
              sort.field === 'progress_percentage' && sort.direction === 'desc'
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Most Progress
          </button>
        </div>
      </div>
    </div>
  )
}
