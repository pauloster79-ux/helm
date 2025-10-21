/**
 * ProposalCard Component
 * 
 * Displays an individual AI-generated proposal with:
 * - Proposal type and confidence badge
 * - Current vs. proposed value comparison
 * - Rationale and evidence
 * - Accept/Modify/Reject/Defer actions
 */

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Textarea } from '../ui/textarea';
import type { ProposalWithDetails } from '../../types/database.types';

interface ProposalCardProps {
  proposal: ProposalWithDetails;
  onAccept: (id: string, modifications?: any) => Promise<void>;
  onReject: (id: string, feedback?: string) => Promise<void>;
  onDefer: (id: string) => Promise<void>;
  className?: string;
}

export function ProposalCard({
  proposal,
  onAccept,
  onReject,
  onDefer,
  className = ''
}: ProposalCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showModify, setShowModify] = useState(false);
  const [modifiedValue, setModifiedValue] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);
  
  // Check if this is an insight (not a proposal)
  const isInsight = proposal.activity_type === 'insight';

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      // For insights, we just acknowledge them (no modifications possible)
      if (isInsight) {
        // Mark as acknowledged - we'll handle this as a special 'accepted' status
        await onAccept(proposal.id);
      } else {
        await onAccept(proposal.id);
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptModified = async () => {
    setIsProcessing(true);
    try {
      await onAccept(proposal.id, { 
        [(proposal.parsedChanges as any).field || 'value']: modifiedValue 
      });
      setShowModify(false);
    } catch (error) {
      console.error('Error accepting modified proposal:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(proposal.id, feedback || undefined);
      setShowFeedback(false);
      setFeedback('');
    } catch (error) {
      console.error('Error rejecting proposal:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDefer = async () => {
    setIsProcessing(true);
    try {
      await onDefer(proposal.id);
    } catch (error) {
      console.error('Error deferring proposal:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get proposal type icon and color
  const getProposalTypeDisplay = () => {
    // Special handling for insights
    if (isInsight) {
      return { icon: Lightbulb, label: 'Insight', color: 'text-purple-600' };
    }
    
    switch (proposal.proposal_type) {
      case 'field_improvement':
        return { icon: TrendingUp, label: 'Improvement', color: 'text-blue-600' };
      case 'missing_information':
        return { icon: Lightbulb, label: 'Missing Info', color: 'text-yellow-600' };
      case 'status_conflict':
        return { icon: AlertTriangle, label: 'Conflict', color: 'text-red-600' };
      default:
        return { icon: Lightbulb, label: proposal.proposal_type, color: 'text-gray-600' };
    }
  };

  // Get confidence display
  const getConfidenceDisplay = () => {
    switch (proposal.confidence) {
      case 'high':
        return { dots: 3, color: 'bg-green-500', label: 'High' };
      case 'medium':
        return { dots: 2, color: 'bg-yellow-500', label: 'Medium' };
      case 'low':
        return { dots: 1, color: 'bg-gray-400', label: 'Low' };
      default:
        return { dots: 1, color: 'bg-gray-400', label: 'Unknown' };
    }
  };

  const typeDisplay = getProposalTypeDisplay();
  const confidenceDisplay = getConfidenceDisplay();
  const TypeIcon = typeDisplay.icon;

  // Parse changes based on proposal type
  const changes = proposal.parsedChanges as any;

  return (
    <Card className={`${className} ${proposal.confidence === 'high' ? 'border-blue-500 bg-blue-50/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TypeIcon className={`h-4 w-4 ${typeDisplay.color}`} />
            <span className="text-sm font-semibold text-gray-900">{typeDisplay.label}</span>
            {changes.field && (
              <Badge variant="outline" className="text-xs">
                {changes.field}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-2">{confidenceDisplay.label}</span>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i < confidenceDisplay.dots ? confidenceDisplay.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current vs Proposed */}
        {(changes.current_value !== undefined || changes.proposed_value) && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            {changes.current_value !== undefined && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Current</div>
                <div className="text-sm text-red-600 line-through">{changes.current_value || '(empty)'}</div>
              </div>
            )}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                {changes.current_value !== undefined ? 'Proposed' : 'Add'}
              </div>
              <div className="text-sm text-green-600 font-medium">{changes.proposed_value}</div>
            </div>
          </div>
        )}

        {/* Rationale */}
        <div>
          <div className="text-sm text-gray-700 leading-relaxed">
            {proposal.rationale}
          </div>
        </div>

        {/* Evidence (expandable) */}
        {proposal.parsedEvidence && proposal.parsedEvidence.length > 0 && (
          <div>
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {showEvidence ? '▼' : '▶'} Evidence ({proposal.parsedEvidence.length})
            </button>
            {showEvidence && (
              <ul className="mt-2 space-y-1">
                {proposal.parsedEvidence.map((evidence, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span className="flex-1">{evidence}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Impact */}
        {proposal.estimated_impact && (
          <div className="text-xs text-gray-500 italic">
            💡 {proposal.estimated_impact}
          </div>
        )}

        {/* Modify UI */}
        {showModify && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Modify suggested value:
            </label>
            <Textarea
              value={modifiedValue}
              onChange={(e) => setModifiedValue(e.target.value)}
              placeholder="Enter your modified value..."
              className="min-h-[80px]"
            />
          </div>
        )}

        {/* Feedback UI */}
        {showFeedback && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Why are you rejecting this? (optional)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Help the AI learn..."
              className="min-h-[60px]"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        {!showModify && !showFeedback && (
          <>
            {isInsight ? (
              // Insights only have "Got it" button
              <Button
                size="sm"
                onClick={handleAccept}
                disabled={isProcessing}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Got it
              </Button>
            ) : (
              // Proposals have full action set
              <>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setModifiedValue(changes.proposed_value || '');
                    setShowModify(true);
                  }}
                  disabled={isProcessing}
                >
                  Modify
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFeedback(true)}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDefer}
                  disabled={isProcessing}
                  className="text-gray-600"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Later
                </Button>
              </>
            )}
          </>
        )}

        {showModify && (
          <>
            <Button
              size="sm"
              onClick={handleAcceptModified}
              disabled={isProcessing || !modifiedValue}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Apply Modified
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowModify(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </>
        )}

        {showFeedback && (
          <>
            <Button
              size="sm"
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Confirm Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowFeedback(false);
                setFeedback('');
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

