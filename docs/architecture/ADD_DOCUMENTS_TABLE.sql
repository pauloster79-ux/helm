-- Helm Documents Component Database Schema
-- Adds documents table and Supabase Storage configuration for project documents

-- =====================================================
-- DOCUMENTS TABLE
-- Stores document metadata for projects
-- =====================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Core document info
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  file_name TEXT NOT NULL, -- Original filename
  file_type TEXT NOT NULL, -- MIME type
  file_size INTEGER NOT NULL, -- Size in bytes
  
  -- Categorization
  document_type TEXT NOT NULL DEFAULT 'other' CHECK (
    document_type IN ('requirements', 'design', 'meeting_notes', 'reports', 'reference', 'other')
  ),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'review', 'final', 'archived')
  ),
  
  -- Authorship & versioning
  author TEXT, -- Document author (may differ from uploader)
  version_number INTEGER NOT NULL DEFAULT 1,
  
  -- Access tracking
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS documents_project_id_idx ON documents(project_id);
CREATE INDEX IF NOT EXISTS documents_uploaded_by_idx ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS documents_document_type_idx ON documents(document_type);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents(status);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at);
CREATE INDEX IF NOT EXISTS documents_deleted_at_idx ON documents(deleted_at);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
-- Users can view documents if they have access to the project
CREATE POLICY "Users can view documents from accessible projects"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = documents.project_id 
      AND p.user_id = auth.uid()
    )
  );

-- Users can insert documents if they own the project
CREATE POLICY "Users can insert documents to own projects"
  ON documents FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = documents.project_id 
      AND p.user_id = auth.uid()
    )
  );

-- Users can update documents if they uploaded them or own the project
CREATE POLICY "Users can update documents they uploaded or own project"
  ON documents FOR UPDATE
  USING (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = documents.project_id 
      AND p.user_id = auth.uid()
    )
  );

-- Users can delete documents if they uploaded them or own the project
CREATE POLICY "Users can delete documents they uploaded or own project"
  ON documents FOR DELETE
  USING (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = documents.project_id 
      AND p.user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Trigger to auto-update updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_document_download_count(document_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE documents 
  SET 
    download_count = download_count + 1,
    last_accessed_at = NOW()
  WHERE id = document_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SUPABASE STORAGE SETUP
-- =====================================================

-- Note: Storage bucket creation and policies are typically done in Supabase Dashboard
-- or via the Supabase client. This section documents the required setup:

/*
Storage Bucket: project-documents

Storage Policies:
1. "Users can view documents from accessible projects"
   - SELECT: Users can download files if they have access to the project

2. "Users can upload documents to own projects" 
   - INSERT: Users can upload files to projects they own

3. "Users can update documents they uploaded or own project"
   - UPDATE: Users can update files they uploaded or in projects they own

4. "Users can delete documents they uploaded or own project"
   - DELETE: Users can delete files they uploaded or in projects they own

Allowed File Types:
- application/pdf
- application/msword
- application/vnd.openxmlformats-officedocument.wordprocessingml.document
- text/plain
- text/markdown
- image/jpeg
- image/png

Max File Size: 10MB (can be adjusted based on needs)
*/

-- =====================================================
-- NOTES
-- =====================================================

-- To apply this schema:
-- 1. Run this SQL in Supabase Dashboard > SQL Editor
-- 2. Create storage bucket "project-documents" in Supabase Dashboard > Storage
-- 3. Set up storage policies as documented above
-- 4. Generate TypeScript types: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts

-- Future enhancements (not in MVP):
-- - Document versioning with file history
-- - AI processing status tracking
-- - Document embedding storage for search
-- - Document relationships (references, dependencies)
-- - Access control at document level (beyond project level)

