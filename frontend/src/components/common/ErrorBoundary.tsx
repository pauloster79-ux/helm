import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-red-900 mb-2">Application Error</h1>
                <p className="text-red-700 mb-4">
                  Something went wrong while loading the application.
                </p>
                
                {this.state.error && (
                  <details className="text-left bg-red-50 border border-red-200 rounded p-3 mb-4">
                    <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                      Error Details
                    </summary>
                    <pre className="text-xs text-red-600 whitespace-pre-wrap">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reload Application
                  </button>
                  
                  <p className="text-sm text-red-600">
                    If the problem persists, please check:
                  </p>
                  <ul className="text-sm text-red-600 text-left space-y-1">
                    <li>• Your internet connection</li>
                    <li>• Supabase project configuration</li>
                    <li>• Browser console for more details</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
