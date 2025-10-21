/**
 * AssistantPane Component
 * 
 * The right-side AI assistant pane with 30% width (70/30 split).
 * Based on the mockup in task-edit-interactive.html
 * 
 * Features:
 * - Always visible on the right side
 * - Shows AI proposals
 * - Collapsible
 * - Chat input footer
 * - Help links
 */

import { useState } from 'react';
import { Lightbulb, MessageCircle, Send, PanelRight, RefreshCw, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ActivityFeed } from './ActivityFeed';
import { useProposals } from '../../hooks/useProposals';

interface AssistantPaneProps {
  projectId?: string;
  componentId?: string;
  componentType?: 'task' | 'risk' | 'decision' | 'milestone';
  collapsed?: boolean; // Controlled prop
  defaultCollapsed?: boolean; // Fallback for uncontrolled usage
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

export function AssistantPane({
  projectId,
  componentId,
  componentType = 'task',
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapse,
  className = ''
}: AssistantPaneProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [localQAs, setLocalQAs] = useState<Array<{question: string, answer: string, timestamp: string}>>([]);

  // Use controlled prop if provided, otherwise use internal state
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  // Use proposals hook with real-time updates (only if projectId is provided)
  const {
    proposals,
    loading,
    error,
    pendingCount,
    acceptProposal,
    rejectProposal,
    deferProposal,
    refresh
  } = useProposals({
    projectId: projectId || '', // Empty string if no project selected
    componentId,
    componentType,
    filters: {}, // No filters at this level - handled by ProposalQueue
    autoRefresh: !!projectId, // Only auto-refresh if we have a project
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed;
    // Update internal state if uncontrolled
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    // Always notify parent
    onCollapse?.(newCollapsed);
  };

  const handleSendMessage = async () => {
    console.log('[AssistantPane] handleSendMessage called', { 
      chatMessage, 
      sendingMessage, 
      projectId 
    });
    
    if (!chatMessage.trim() || sendingMessage) {
      console.log('[AssistantPane] Early return - no message or already sending');
      return;
    }
    
    if (!projectId) {
      console.warn('[AssistantPane] No project selected');
      return;
    }

    setSendingMessage(true);
    const questionText = chatMessage.trim();
    
    console.log('[AssistantPane] Sending question:', questionText);
    
    try {
      // Clear the input immediately for better UX
      setChatMessage('');

      // Call FastAPI service directly
      const response = await fetch('http://localhost:8001/answer-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          question: questionText,
          user_id: null // Optional
        })
      });

      console.log('[AssistantPane] Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('[AssistantPane] Error from backend:', error);
        throw new Error(error.message || 'Failed to get answer');
      }

      const data = await response.json();
      console.log('[AssistantPane] Answer received:', data);

      // Add Q&A to local state for immediate display
      setLocalQAs(prev => [...prev, {
        question: questionText,
        answer: data.answer,
        timestamp: new Date().toISOString()
      }]);

      // Also refresh to get any database proposals
      await refresh();
      
    } catch (error) {
      console.error('[AssistantPane] Error sending message:', error);
      // Restore the message on error
      setChatMessage(questionText);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAssessProject = async () => {
    console.log('[AssistantPane] handleAssessProject called', { projectId, assessing, componentId, componentType });
    
    if (!projectId || assessing) {
      console.log('[AssistantPane] Early return - no project or already assessing', { projectId, assessing });
      if (!projectId) {
        alert('No project selected. Please select a project first.');
      }
      return;
    }

    setAssessing(true);
    
    try {
      console.log('[AssistantPane] Sending assessment request for project:', projectId);
      
      // Call FastAPI service
      const response = await fetch('http://localhost:8001/assess-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          user_id: null // Optional
        })
      });

      console.log('[AssistantPane] Assessment response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('[AssistantPane] Error from backend:', error);
        throw new Error(error.detail || 'Failed to assess project');
      }

      const data = await response.json();
      console.log('[AssistantPane] Assessment completed:', data);

      // Refresh to load new insights
      await refresh();
      
    } catch (error) {
      console.error('[AssistantPane] Error assessing project:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to assess project: ${errorMessage}`);
    } finally {
      setAssessing(false);
    }
  };

  if (collapsed) {
    return (
      <div className={`w-16 bg-white border-l border-gray-200 shadow-lg flex flex-col h-full ${className}`}>
        <div className="flex flex-col items-center p-2 gap-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleCollapse}
            className="w-full"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
          
          {pendingCount > 0 && (
            <div className="relative">
              <Lightbulb className="h-5 w-5 text-amber-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
                {pendingCount}
              </span>
            </div>
          )}
          
          {assessing && (
            <div className="relative">
              <Search className="h-5 w-5 text-amber-500 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-gray-50 border-l border-gray-200 shadow-lg flex flex-col h-full transition-transform duration-300 ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAssessProject}
              disabled={!projectId || assessing}
              className="h-6 w-6 p-0 hover:bg-amber-50"
              title={projectId ? "Assess Project" : "Select a project first"}
            >
              <Search className={`h-4 w-4 text-amber-500 ${assessing ? 'animate-pulse' : ''} ${!projectId ? 'opacity-50' : ''}`} />
            </Button>
            <h2 className="text-sm font-semibold text-gray-900">Project Assistant</h2>
            {pendingCount > 0 && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setRefreshing(true);
                refresh().finally(() => setRefreshing(false));
              }}
              disabled={refreshing}
              className="h-8 w-8 p-0"
              title="Refresh AI analysis"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleCollapse}
              className="h-8 w-8 p-0"
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {componentId ? 'Editing a task...' : projectId ? 'Ready to help' : 'Select a project to assess'}
        </p>
      </div>

      {/* Activity Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        <ActivityFeed
          proposals={proposals}
          loading={loading}
          error={error}
          onAccept={acceptProposal}
          onReject={rejectProposal}
          onDefer={deferProposal}
          localQAs={localQAs}
        />
      </div>

      {/* Help Section */}
      {!loading && (
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-700 mb-2">Need Help?</div>
          <div className="space-y-1">
            <a href="#" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">
              What makes a good task description?
            </a>
            <a href="#" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">
              How to write acceptance criteria?
            </a>
            <a href="#" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">
              How to estimate time?
            </a>
          </div>
        </div>
      )}

      {/* Chat Input Footer */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Input
            type="text"
            placeholder={componentId ? "Ask about this task..." : projectId ? "Ask about this project..." : "Ask me anything..."}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={sendingMessage}
            className="flex-1 h-8 text-sm"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!chatMessage.trim() || sendingMessage}
            className="h-8 w-8 p-0"
            title={sendingMessage ? "Sending..." : "Send message"}
          >
            {sendingMessage ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

