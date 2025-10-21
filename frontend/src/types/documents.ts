// Document-related TypeScript types for Helm

export type DocumentType = 
  | 'requirements' 
  | 'design' 
  | 'meeting_notes' 
  | 'reports' 
  | 'reference' 
  | 'other';

export type DocumentStatus = 
  | 'draft' 
  | 'review' 
  | 'final' 
  | 'archived';

export interface Document {
  id: string;
  project_id: string;
  uploaded_by: string;
  
  // Core document info
  title: string;
  description?: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  
  // Categorization
  document_type: DocumentType;
  status: DocumentStatus;
  
  // Authorship & versioning
  author?: string;
  version_number: number;
  
  // Access tracking
  last_accessed_at?: string;
  download_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface DocumentUpload {
  file: File;
  title: string;
  description?: string;
  document_type: DocumentType;
  status: DocumentStatus;
  author?: string;
}

export interface DocumentFilter {
  document_type?: DocumentType | 'all';
  status?: DocumentStatus | 'all';
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'file_size';
  sort_order?: 'asc' | 'desc';
}

export interface DocumentFormData {
  title: string;
  description?: string;
  document_type: DocumentType;
  status: DocumentStatus;
  author?: string;
}

export interface DocumentUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Document type labels for UI display
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  requirements: 'Requirements',
  design: 'Design',
  meeting_notes: 'Meeting Notes',
  reports: 'Reports',
  reference: 'Reference',
  other: 'Other'
};

// Document status labels for UI display
export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: 'Draft',
  review: 'Review',
  final: 'Final',
  archived: 'Archived'
};

// File type validation
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'image/jpeg',
  'image/png'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.md',
  '.jpg',
  '.jpeg',
  '.png'
] as const;

// Helper function to get file type from MIME type
export function getDocumentTypeFromMimeType(mimeType: string): DocumentType {
  if (mimeType.includes('pdf')) return 'reference';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'requirements';
  if (mimeType.includes('text/plain')) return 'other';
  if (mimeType.includes('markdown')) return 'reference';
  if (mimeType.includes('image')) return 'design';
  return 'other';
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to validate file
export function validateFile(file: File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return `File type ${file.type} is not supported`;
  }

  return null;
}

// Helper function to get file icon based on type
export function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('text')) return '📄';
  if (fileType.includes('markdown')) return '📝';
  if (fileType.includes('image')) return '🖼️';
  return '📄';
}
