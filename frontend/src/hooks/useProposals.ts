/**
 * useProposals Hook
 * 
 * Manages proposal data fetching, filtering, and actions (accept/reject/modify)
 * for the AI Assistant Pane.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  ProposalFilters,
  ProposalWithDetails,
  Database 
} from '../types/database.types';

interface UseProposalsOptions {
  projectId?: string;
  componentId?: string;
  componentType?: string;
  filters?: ProposalFilters;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseProposalsReturn {
  proposals: ProposalWithDetails[];
  loading: boolean;
  error: Error | null;
  pendingCount: number;
  acceptProposal: (id: string, modifications?: any) => Promise<void>;
  rejectProposal: (id: string, feedback?: string) => Promise<void>;
  deferProposal: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProposals(options: UseProposalsOptions = {}): UseProposalsReturn {
  const {
    projectId,
    componentId,
    componentType,
    filters,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds default
  } = options;

  const [proposals, setProposals] = useState<ProposalWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize filter dependencies to prevent infinite loops
  const filterDeps = useMemo(() => ({
    status: filters?.status,
    component_type: filters?.component_type,
    confidence: filters?.confidence,
    proposal_type: filters?.proposal_type,
    created_after: filters?.created_after,
    created_before: filters?.created_before,
  }), [
    filters?.status,
    filters?.component_type,
    filters?.confidence,
    filters?.proposal_type,
    filters?.created_after,
    filters?.created_before,
  ]);

  /**
   * Fetch proposals from Supabase
   */
  const fetchProposals = useCallback(async () => {
    // Don't fetch if no projectId
    if (!projectId) {
      setProposals([]);
      setPendingCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query
      let query = supabase
        .from('proposals')
        .select('*, reviewer:reviewed_by(id, full_name, avatar_url)')
        .order('created_at', { ascending: false });

      // Apply filters
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      if (componentId) {
        query = query.eq('component_id', componentId);
      }

      if (componentType) {
        query = query.eq('component_type', componentType);
      }

      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.component_type && filters.component_type.length > 0) {
        query = query.in('component_type', filters.component_type);
      }

      if (filters?.confidence && filters.confidence.length > 0) {
        query = query.in('confidence', filters.confidence);
      }

      if (filters?.proposal_type && filters.proposal_type.length > 0) {
        query = query.in('proposal_type', filters.proposal_type);
      }

      if (filters?.created_after) {
        query = query.gte('created_at', filters.created_after);
      }

      if (filters?.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform proposals to include parsed data
      const transformedProposals: ProposalWithDetails[] = (data || []).map((proposal: any) => ({
        ...proposal,
        // Only parse changes for proposals (not for insights/Q&A)
        parsedChanges: proposal.activity_type === 'proposal' && proposal.changes
          ? (typeof proposal.changes === 'string' ? JSON.parse(proposal.changes) : proposal.changes)
          : undefined,
        parsedEvidence: typeof proposal.evidence === 'string'
          ? JSON.parse(proposal.evidence)
          : (Array.isArray(proposal.evidence) ? proposal.evidence : []),
        reviewer: proposal.reviewer || null
      }));

      setProposals(transformedProposals);

      // Count pending items (exclude answers since they're auto-accepted)
      const pending = transformedProposals.filter(p => 
        p.status === 'pending' && p.activity_type !== 'answer'
      ).length;
      setPendingCount(pending);

    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId, componentId, componentType, filterDeps]);

  /**
   * Accept a proposal and optionally apply modifications
   */
  const acceptProposal = useCallback(async (id: string, modifications?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updates: Database['public']['Tables']['proposals']['Update'] = {
        status: modifications ? 'modified' : 'accepted',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        modifications: modifications || null
      };

      const { error: updateError } = await (supabase as any)
        .from('proposals')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Refresh proposals list
      await fetchProposals();

      // TODO: Apply the actual changes to the component (task, risk, etc.)
      // This will be implemented when we integrate with the backend

    } catch (err) {
      console.error('Error accepting proposal:', err);
      throw err;
    }
  }, [fetchProposals]);

  /**
   * Reject a proposal with optional feedback
   */
  const rejectProposal = useCallback(async (id: string, feedback?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updates: Database['public']['Tables']['proposals']['Update'] = {
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        feedback: feedback || null
      };

      const { error: updateError } = await (supabase as any)
        .from('proposals')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Refresh proposals list
      await fetchProposals();

    } catch (err) {
      console.error('Error rejecting proposal:', err);
      throw err;
    }
  }, [fetchProposals]);

  /**
   * Defer a proposal (save for later)
   */
  const deferProposal = useCallback(async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updates: Database['public']['Tables']['proposals']['Update'] = {
        status: 'deferred',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      };

      const { error: updateError } = await (supabase as any)
        .from('proposals')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Refresh proposals list
      await fetchProposals();

    } catch (err) {
      console.error('Error deferring proposal:', err);
      throw err;
    }
  }, [fetchProposals]);

  // Initial fetch
  useEffect(() => {
    fetchProposals();
  }, [projectId, componentId, componentType, filterDeps]); // Use stable dependencies

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchProposals();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchProposals]);

  // Real-time subscription to proposals
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`proposals:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposals',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Proposal changed:', payload);
          // Debounce the fetch to prevent rapid re-renders
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
          }
          debounceRef.current = setTimeout(() => {
            fetchProposals();
          }, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [projectId, fetchProposals]);

  return {
    proposals,
    loading,
    error,
    pendingCount,
    acceptProposal,
    rejectProposal,
    deferProposal,
    refresh: fetchProposals
  };
}

