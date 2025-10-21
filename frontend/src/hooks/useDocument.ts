import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Document, DocumentFormData } from '@/types/documents';

export function useDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDocument = async (documentData: DocumentFormData & { 
    projectId: string; 
    filePath: string; 
    fileName: string; 
    fileType: string; 
    fileSize: number; 
  }) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('documents')
        .insert({
          project_id: documentData.projectId,
          uploaded_by: user.id,
          title: documentData.title,
          description: documentData.description,
          file_path: documentData.filePath,
          file_name: documentData.fileName,
          file_type: documentData.fileType,
          file_size: documentData.fileSize,
          document_type: documentData.document_type,
          status: documentData.status,
          author: documentData.author,
          version_number: 1
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error creating document:', err);
      setError(err instanceof Error ? err.message : 'Failed to create document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (documentId: string, updates: Partial<DocumentFormData>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err instanceof Error ? err.message : 'Failed to update document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Soft delete by setting deleted_at timestamp
      const { error } = await supabase
        .from('documents')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', documentId);

      if (error) {
        throw error;
      }

      // Also delete the file from storage
      // Get the file path first
      const { data: document } = await supabase
        .from('documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (document?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('project-documents')
          .remove([document.file_path]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Don't throw here as the database record is already soft deleted
        }
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const incrementDownloadCount = async (documentId: string) => {
    try {
      const { error } = await supabase.rpc('increment_document_download_count', {
        document_id: documentId
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error incrementing download count:', err);
      // Don't throw here as this is not critical
    }
  };

  const getDownloadUrl = async (document: Document): Promise<string> => {
    try {
      const { data, error } = await supabase.storage
        .from('project-documents')
        .createSignedUrl(document.file_path, 3600); // 1 hour expiry

      if (error) {
        throw error;
      }

      // Increment download count
      await incrementDownloadCount(document.id);

      return data.signedUrl;
    } catch (err) {
      console.error('Error getting download URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to get download URL');
      throw err;
    }
  };

  return {
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    getDownloadUrl
  };
}
