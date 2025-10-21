/**
 * ActivityCard Component
 * 
 * Displays different types of AI activities:
 * - Proposals (actionable AI suggestions)
 * - Insights (non-actionable AI observations)
 * - Q&A (user questions and AI answers)
 */

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Lightbulb, TrendingUp, AlertTriangle, Bot, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Textarea } from '../ui/textarea';
import type { ProposalWithDetails } from '../../types/database.types';

interface ActivityCardProps {
  proposal: ProposalWithDetails;
  onAccept: (id: string, modifications?: any) => Promise<void>;
  onReject: (id: string, feedback?: string) => Promise<void>;
  onDefer: (id: string) => Promise<void>;
  compact?: boolean;
  className?: string;
}

// Proposal Card (existing functionality)
function ProposalCard({
  proposal,
  onAccept,
  onReject,
  onDefer,
  isProcessing,
  setIsProcessing,
  showFeedback,
  setShowFeedback,
  feedback,
  setFeedback,
  showModify,
  setShowModify,
  modifiedValue,
  setModifiedValue,
  showEvidence,
  setShowEvidence,
  className = ''
}: {
  proposal: ProposalWithDetails;
  onAccept: (id: string, modifications?: any) => Promise<void>;
  onReject: (id: string, feedback?: string) => Promise<void>;
  onDefer: (id: string) => Promise<void>;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
  feedback: string;
  setFeedback: (feedback: string) => void;
  showModify: boolean;
  setShowModify: (show: boolean) => void;
  modifiedValue: string;
  setModifiedValue: (value: string) => void;
  showEvidence: boolean;
  setShowEvidence: (show: boolean) => void;
  className?: string;
}) {
  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept(proposal.id);
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
        return { dots: 0, color: 'bg-gray-200', label: 'Unknown' };
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

// Insight Card (new - non-actionable observations)
function InsightCard({
  proposal,
  onDismiss,
  isProcessing,
  setIsProcessing,
  className = ''
}: {
  proposal: ProposalWithDetails;
  onDismiss: (id: string) => Promise<void>;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  className?: string;
}) {
  const [showEvidence, setShowEvidence] = useState(false);

  const handleDismiss = async () => {
    setIsProcessing(true);
    try {
      await onDismiss(proposal.id);
    } catch (error) {
      console.error('Error dismissing insight:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`${className} border-amber-200 bg-amber-50/50`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">Insight</span>
          <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
            Observation
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Insight Content */}
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
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDismiss}
          disabled={isProcessing}
          className="text-gray-600"
        >
          Got it
        </Button>
      </CardFooter>
    </Card>
  );
}

// Question Card (new - user questions)
function QuestionCard({
  proposal,
  className = ''
}: {
  proposal: ProposalWithDetails;
  className?: string;
}) {
  return (
    <Card className={`${className} border-blue-200 bg-blue-50/50`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-700 leading-relaxed">
              {proposal.rationale}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(proposal.created_at).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Answer Card (new - AI answers)
function AnswerCard({
  proposal,
  showEvidence,
  setShowEvidence,
  className = ''
}: {
  proposal: ProposalWithDetails;
  showEvidence: boolean;
  setShowEvidence: (show: boolean) => void;
  className?: string;
}) {
  return (
    <Card className={`${className} border-green-200 bg-green-50/50`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-700 leading-relaxed">
              {proposal.rationale}
            </div>

            {/* Evidence (expandable) */}
            {proposal.parsedEvidence && proposal.parsedEvidence.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => setShowEvidence(!showEvidence)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showEvidence ? '▼' : '▶'} Sources ({proposal.parsedEvidence.length})
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

            <div className="text-xs text-gray-500 mt-2">
              {new Date(proposal.created_at).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main ActivityCard component
export function ActivityCard({
  proposal,
  onAccept,
  onReject,
  onDefer,
  className = ''
}: ActivityCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showModify, setShowModify] = useState(false);
  const [modifiedValue, setModifiedValue] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);

  // Route to appropriate card type based on activity_type
  switch (proposal.activity_type) {
    case 'question':
      return <QuestionCard proposal={proposal} className={className} />;
    
    case 'answer':
      return (
        <AnswerCard 
          proposal={proposal} 
          showEvidence={showEvidence}
          setShowEvidence={setShowEvidence}
          className={className} 
        />
      );
    
    case 'insight':
      return (
        <InsightCard 
          proposal={proposal} 
          onDismiss={onReject}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          className={className} 
        />
      );
    
    case 'proposal':
    default:
      return (
        <ProposalCard
          proposal={proposal}
          onAccept={onAccept}
          onReject={onReject}
          onDefer={onDefer}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          feedback={feedback}
          setFeedback={setFeedback}
          showModify={showModify}
          setShowModify={setShowModify}
          modifiedValue={modifiedValue}
          setModifiedValue={setModifiedValue}
          showEvidence={showEvidence}
          setShowEvidence={setShowEvidence}
          className={className}
        />
      );
  }
}