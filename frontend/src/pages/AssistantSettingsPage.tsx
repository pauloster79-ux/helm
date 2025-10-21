/**
 * AssistantSettingsPage Component
 * 
 * Organization-level page for configuring AI Assistant settings.
 * These settings apply to all projects within the organization.
 * 
 * Features:
 * - AI model selection
 * - Validation preferences
 * - Cost limits
 * - Feature toggles
 * 
 * Accessible from the left sidebar under "Project Assistant" section.
 */

import { Settings } from 'lucide-react';
import { AIConfigPanel } from '../components/ai/AIConfigPanel';
import { useAuth } from '../contexts/AuthContext';

export function AssistantSettingsPage() {
  const { organizationId, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // For now, we'll use a fallback organization ID if none is available
  // This allows the AI Configuration page to work while the organization setup is being resolved
  const effectiveOrganizationId = organizationId || 'default-org';

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Project Assistant</h1>
            <p className="text-sm text-gray-500">Configure AI behavior for all your organization's projects</p>
          </div>
        </div>
      </div>

      {/* Organization Setup Warning */}
      {!organizationId && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Organization Setup:</strong> Your organization profile is being configured. AI settings will be saved to your personal workspace for now.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AIConfigPanel 
          organizationId={effectiveOrganizationId} 
          className="h-full overflow-y-auto"
        />
      </div>
    </div>
  );
}

export default AssistantSettingsPage;
