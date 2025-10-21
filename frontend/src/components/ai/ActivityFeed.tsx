/**
 * ActivityFeed Component
 * 
 * Displays a simple action inbox of AI activities:
 * - Proposals (actionable AI suggestions)
 * - Insights (non-actionable AI observations)
 * - Q&A (user questions and AI answers)
 * 
 * Features:
 * - Simple list of activities for quick action
 * - Empty states
 * - Loading states
 * - Scrollable list of ActivityCards
 */

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { ActivityCard } from './ActivityCard';
import type { ProposalWithDetails } from '../../types/database.types';

interface LocalQA {
  question: string;
  answer: string;
  timestamp: string;
}

interface ActivityFeedProps {
  proposals: ProposalWithDetails[];
  loading: boolean;
  error: Error | null;
  onAccept: (id: string, modifications?: any) => Promise<void>;
  onReject: (id: string, feedback?: string) => Promise<void>;
  onDefer: (id: string) => Promise<void>;
  localQAs?: LocalQA[];
  className?: string;
}

export function ActivityFeed({
  proposals,
  loading,
  error,
  onAccept,
  onReject,
  onDefer,
  localQAs = [],
  className = ''
}: ActivityFeedProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    
    // Always scroll to bottom when new content is added (unless user is actively scrolling up)
    if (!isUserScrolling) {
      // Use requestAnimationFrame to ensure DOM is updated before scrolling
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
  }, [localQAs, proposals, isUserScrolling]);

  // Initial scroll to bottom when component mounts with existing content
  useEffect(() => {
    if (scrollContainerRef.current && (localQAs.length > 0 || proposals.length > 0)) {
      const scrollContainer = scrollContainerRef.current;
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
  }, []); // Only run on mount

  // Track user scrolling to prevent auto-scroll when user is reviewing history
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsUserScrolling(true);
      clearTimeout(scrollTimeout);
      
      // Reset user scrolling flag after 1 second of no scrolling
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1000);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* Content starts directly without header */}

      {/* Activities list */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <>
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">Failed to load activities</p>
            <p className="text-xs text-gray-500 mb-4">{error.message}</p>
            <Button size="sm" variant="outline">
              Try Again
            </Button>
          </div>
        )}


        {!loading && !error && localQAs.length > 0 && (
          <>
            {localQAs.map((qa, index) => (
              <div key={`local-qa-${index}`} className="space-y-3">
                {/* Question */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">Q</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {qa.question}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(qa.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Answer */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">A</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {qa.answer}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(qa.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && !error && proposals.length > 0 && (
          <>
            {proposals.map((proposal) => (
              <ActivityCard
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

    </div>
  );
}