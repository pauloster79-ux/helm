import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { DocumentUpload, DocumentUploadProgress } from '@/types/documents';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/types/documents';

export function useDocumentUpload() {
  const [uploadProgress, setUploadProgress] = useState<DocumentUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
      return `File type ${file.type} is not supported`;
    }

    return null;
  };

  const uploadFile = useCallback(async (
    file: File,
    projectId: string,
    _onProgress?: (progress: number) => void
  ): Promise<string> => {
    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Generate unique file path
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `${projectId}/${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      return filePath;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  }, []);

  const uploadDocument = useCallback(async (
    uploadData: DocumentUpload,
    projectId: string,
    onProgress?: (progress: number) => void
  ) => {
    const file = uploadData.file;
    
    try {
      setIsUploading(true);
      setError(null);

      // Add to progress tracking
      const progressItem: DocumentUploadProgress = {
        file,
        progress: 0,
        status: 'uploading'
      };
      setUploadProgress(prev => [...prev, progressItem]);

      // Update progress to 50% when upload starts
      onProgress?.(50);
      setUploadProgress(prev => 
        prev.map(item => 
          item.file === file 
            ? { ...item, progress: 50 }
            : item
        )
      );

      // Upload file
      const filePath = await uploadFile(file, projectId, onProgress);

      // Update progress to 90% when upload completes
      onProgress?.(90);
      setUploadProgress(prev => 
        prev.map(item => 
          item.file === file 
            ? { ...item, progress: 90, status: 'processing' }
            : item
        )
      );

      // Create document record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          uploaded_by: user.id,
          title: uploadData.title,
          description: uploadData.description,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          document_type: uploadData.document_type,
          status: uploadData.status,
          author: uploadData.author,
          version_number: 1
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update progress to 100% when complete
      onProgress?.(100);
      setUploadProgress(prev => 
        prev.map(item => 
          item.file === file 
            ? { ...item, progress: 100, status: 'completed' }
            : item
        )
      );

      return data;
    } catch (err) {
      console.error('Error uploading document:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
      
      // Update progress with error
      setUploadProgress(prev => 
        prev.map(item => 
          item.file === file 
            ? { ...item, status: 'error', error: errorMessage }
            : item
        )
      );

      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile]);

  const uploadMultipleDocuments = useCallback(async (
    uploads: DocumentUpload[],
    projectId: string,
    onBatchProgress?: (completed: number, total: number) => void
  ) => {
    try {
      setIsUploading(true);
      setError(null);

      const results = [];
      let completed = 0;

      for (const upload of uploads) {
        try {
          const result = await uploadDocument(upload, projectId);
          results.push(result);
          completed++;
          onBatchProgress?.(completed, uploads.length);
        } catch (err) {
          console.error(`Error uploading ${upload.file.name}:`, err);
          // Continue with other uploads even if one fails
        }
      }

      return results;
    } catch (err) {
      console.error('Error uploading multiple documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload documents');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [uploadDocument]);

  const clearUploadProgress = () => {
    setUploadProgress([]);
    setError(null);
  };

  const removeUploadProgress = (file: File) => {
    setUploadProgress(prev => prev.filter(item => item.file !== file));
  };

  return {
    uploadProgress,
    isUploading,
    error,
    uploadDocument,
    uploadMultipleDocuments,
    clearUploadProgress,
    removeUploadProgress,
    validateFile
  };
}
