/**
 * InlineSuggestion Component
 * 
 * Displays inline AI suggestions below form fields as the user types.
 * Shows real-time validation feedback with an "Apply" button.
 */

import { Sparkles, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import type { AIProposal, ValidationIssue } from '../../types/database.types';

interface InlineSuggestionProps {
  proposals: AIProposal[];
  issues: ValidationIssue[];
  isAnalyzing: boolean;
  onApply: (proposal: AIProposal) => void;
  onDismiss: (proposal: AIProposal) => void;
  className?: string;
}

export function InlineSuggestion({
  proposals,
  issues,
  isAnalyzing,
  onApply,
  onDismiss,
  className = ''
}: InlineSuggestionProps) {
  // Don't show anything if no suggestions or issues
  if (!isAnalyzing && proposals.length === 0 && issues.length === 0) {
    return null;
  }

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'border-green-500 bg-green-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-gray-400 bg-gray-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`mt-2 space-y-2 ${className}`}>
      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md animate-pulse">
          <Sparkles className="h-4 w-4 text-blue-500 animate-spin" />
          <span className="font-medium">AI is analyzing your input...</span>
        </div>
      )}

      {/* Issues */}
      {issues.map((issue, index) => (
        <div
          key={`issue-${index}`}
          className={`flex items-start gap-2 px-3 py-2 rounded-md border ${
            issue.severity === 'error'
              ? 'bg-red-50 border-red-200'
              : issue.severity === 'warning'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          {getSeverityIcon(issue.severity)}
          <span className="text-sm flex-1">{issue.message}</span>
        </div>
      ))}

      {/* Proposals */}
      {proposals.map((proposal, index) => (
        <div
          key={`proposal-${index}`}
          className={`border-l-4 rounded-r-md shadow-sm ${getConfidenceColor(proposal.confidence)} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in slide-in-from-top-2 fade-in-50`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="p-3">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  AI Proposal
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    ({proposal.confidence} confidence)
                  </span>
                </p>
                <p className="text-sm text-gray-700 mb-2">{proposal.rationale}</p>
                
                {/* Show proposed value */}
                {proposal.proposed_value && (
                  <div className="bg-white rounded px-3 py-2 text-sm font-mono text-green-700 border border-green-200 mb-2">
                    {typeof proposal.proposed_value === 'string' 
                      ? proposal.proposed_value 
                      : JSON.stringify(proposal.proposed_value, null, 2)}
                  </div>
                )}

                {/* Evidence (collapsed by default) */}
                {proposal.evidence && proposal.evidence.length > 0 && (
                  <details className="mb-2">
                    <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                      Why? ({proposal.evidence.length} reasons)
                    </summary>
                    <ul className="mt-1 ml-4 space-y-1">
                      {proposal.evidence.map((evidence, idx) => (
                        <li key={idx} className="text-xs text-gray-600 list-disc">
                          {evidence}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => onApply(proposal)}
                className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Accept Proposal
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismiss(proposal)}
                className="h-7 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

