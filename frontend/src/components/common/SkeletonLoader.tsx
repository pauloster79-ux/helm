interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'table-row' | 'project-card' | 'task-card'
  count?: number
  className?: string
}

export default function SkeletonLoader({ 
  variant = 'text', 
  count = 1,
  className = '' 
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i)

  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        )
      
      case 'card':
        return (
          <div className={`animate-pulse bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="mt-6 flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        )
      
      case 'table-row':
        return (
          <tr className={`animate-pulse ${className}`}>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
          </tr>
        )
      
      case 'project-card':
        return (
          <div className={`animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        )
      
      case 'task-card':
        return (
          <div className={`animate-pulse bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 bg-gray-200 rounded flex-shrink-0 mt-0.5"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="flex gap-2 mt-3">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <>
      {items.map((i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}

