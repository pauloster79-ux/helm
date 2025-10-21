interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  size = 'md', 
  message,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-3',
    xl: 'h-24 w-24 border-4'
  }

  const spinner = (
    <div className="text-center">
      <div className={`animate-spin rounded-full border-b-primary-600 border-t-transparent border-l-transparent border-r-transparent mx-auto mb-4 ${sizeClasses[size]}`}></div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

