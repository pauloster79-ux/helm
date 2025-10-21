import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Document, DocumentFilter } from '@/types/documents';

interface UseDocumentsOptions {
  projectId: string;
  filter?: DocumentFilter;
}

export function useDocuments({ projectId, filter }: UseDocumentsOptions) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    fetchDocuments();
  }, [projectId, filter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .is('deleted_at', null);

      // Apply filters
      if (filter) {
        if (filter.document_type && filter.document_type !== 'all') {
          query = query.eq('document_type', filter.document_type);
        }
        
        if (filter.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }
        
        if (filter.search) {
          query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
        }
        
        // Apply sorting
        const sortBy = filter.sort_by || 'created_at';
        const sortOrder = filter.sort_order || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = () => {
    fetchDocuments();
  };

  return {
    documents,
    loading,
    error,
    refreshDocuments
  };
}
