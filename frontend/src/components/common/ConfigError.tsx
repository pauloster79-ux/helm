export default function ConfigError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuration Error</h1>
            <p className="text-gray-600">Missing Supabase environment variables</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-gray-700">
            The application could not start because Supabase credentials are not configured.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">To fix this issue:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
              <li>Create a <code className="bg-yellow-100 px-2 py-1 rounded">frontend/.env</code> file</li>
              <li>Copy the contents from <code className="bg-yellow-100 px-2 py-1 rounded">frontend/env.example</code></li>
              <li>Get your Supabase credentials from <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-yellow-900 underline hover:text-yellow-700">app.supabase.com</a></li>
              <li>Update the <code className="bg-yellow-100 px-2 py-1 rounded">.env</code> file with your credentials</li>
              <li>Restart the development server</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Required environment variables:</h3>
            <pre className="text-sm text-gray-700 font-mono">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
            </pre>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📚 Documentation:</h3>
            <p className="text-sm text-blue-800">
              See <code className="bg-blue-100 px-2 py-1 rounded">frontend/DATABASE_SETUP_GUIDE.md</code> for detailed setup instructions.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
          <a
            href="https://app.supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Open Supabase Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

