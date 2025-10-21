import { Button } from '@/components/ui/button'

export default function SetupRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Setup Required
          </h1>
          
          <p className="text-gray-600 mb-6">
            Helm needs to be configured with Supabase credentials to work properly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Setup:</h3>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Create a <code className="bg-gray-200 px-1 rounded">.env</code> file in the <code className="bg-gray-200 px-1 rounded">frontend/</code> directory</li>
              <li>2. Add your Supabase credentials:</li>
            </ol>
            <div className="mt-3 bg-gray-800 text-green-400 p-3 rounded text-xs font-mono">
              <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=your-anon-key</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Get these from your Supabase project dashboard → Settings → API
            </p>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Refresh After Setup
          </Button>
        </div>
      </div>
    </div>
  )
}
