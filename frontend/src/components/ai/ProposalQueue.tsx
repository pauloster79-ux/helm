/**
 * ProposalQueue Component
 * 
 * Displays a filterable list of AI proposals with:
 * - Filter by status, confidence, type
 * - Empty states
 * - Loading states
 * - Scrollable list of ProposalCards
 */

import { useState } from 'react';
import { Filter, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { ProposalCard } from './ProposalCard';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { ProposalWithDetails } from '../../types/database.types';

interface ProposalQueueProps {
  proposals: ProposalWithDetails[];
  loading: boolean;
  error: Error | null;
  onAccept: (id: string, modifications?: any) => Promise<void>;
  onReject: (id: string, feedback?: string) => Promise<void>;
  onDefer: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  className?: string;
}

export function ProposalQueue({
  proposals,
  loading,
  error,
  onAccept,
  onReject,
  onDefer,
  onRefresh,
  className = ''
}: ProposalQueueProps) {
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Filter proposals
  const filteredProposals = proposals.filter(proposal => {
    if (statusFilter !== 'all' && proposal.status !== statusFilter) {
      return false;
    }
    if (confidenceFilter !== 'all' && proposal.confidence !== confidenceFilter) {
      return false;
    }
    return true;
  });

  // Stats
  const stats = {
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header with stats */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">AI Proposals</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-7"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Stats badges */}
        <div className="flex gap-2 mb-3">
          <Badge>
            <Clock className="h-3 w-3 mr-1" />
            {stats.pending} Pending
          </Badge>
          <Badge>
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {stats.accepted} Accepted
          </Badge>
          <Badge>
            <XCircle className="h-3 w-3 mr-1" />
            {stats.rejected} Rejected
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="deferred">Deferred</SelectItem>
            </SelectContent>
          </Select>

          <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Confidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Confidence</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Proposals list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <>
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">Failed to load proposals</p>
            <p className="text-xs text-gray-500 mb-4">{error.message}</p>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No proposals found</p>
            <p className="text-xs text-gray-500 mb-4">
              {statusFilter !== 'all' || confidenceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'AI will analyze your tasks and suggest improvements'}
            </p>
            {(statusFilter !== 'all' || confidenceFilter !== 'all') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setStatusFilter('all');
                  setConfidenceFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {!loading && !error && filteredProposals.length > 0 && (
          <>
            {filteredProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onAccept={onAccept}
                onReject={onReject}
                onDefer={onDefer}
              />
            ))}
          </>
        )}
      </div>

      {/* Footer info */}
      {!loading && filteredProposals.length > 0 && (
        <div className="p-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Showing {filteredProposals.length} of {proposals.length} proposals
          </p>
        </div>
      )}
    </div>
  );
}


