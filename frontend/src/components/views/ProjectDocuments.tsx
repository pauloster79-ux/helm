import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentsList } from '@/components/documents/DocumentsList';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { DocumentDetailModal } from '@/components/documents/DocumentDetailModal';
import { DocumentForm } from '@/components/documents/DocumentForm';
import { useDocument, useDocuments } from '@/hooks';
import type { Document } from '@/types/documents';

interface ProjectDocumentsProps {
  project: {
    id: string;
    name: string;
    description?: string;
  };
}

export default function ProjectDocuments({ project }: ProjectDocumentsProps) {
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { deleteDocument, getDownloadUrl } = useDocument();
  const { refreshDocuments } = useDocuments({ projectId: project.id });

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsDetailModalOpen(true);
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsEditModalOpen(true);
  };

  const handleDeleteDocument = async (document: Document) => {
    if (!confirm(`Are you sure you want to delete "${document.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDocument(document.id);
      refreshDocuments();
      if (selectedDocument?.id === document.id) {
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDownloadDocument = async (doc: Document) => {
    try {
      const downloadUrl = await getDownloadUrl(doc);
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = doc.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleUploadComplete = () => {
    refreshDocuments();
    setActiveTab('documents');
  };

  const handleEditSuccess = () => {
    refreshDocuments();
    setIsDetailModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setSelectedDocument(null);
    setIsDetailModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setSelectedDocument(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage project documents, requirements, and reference materials
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setActiveTab('upload');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">All Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <DocumentsList
            projectId={project.id}
            onViewDocument={handleViewDocument}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
            onDownloadDocument={handleDownloadDocument}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <DocumentUpload
            projectId={project.id}
            onUploadComplete={handleUploadComplete}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DocumentDetailModal
        document={selectedDocument}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onEdit={handleEditDocument}
        onDelete={handleDeleteDocument}
        onDownload={handleDownloadDocument}
      />

      <DocumentForm
        document={selectedDocument}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
