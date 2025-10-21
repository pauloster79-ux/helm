import { useState } from 'react';
import { Download, Eye, Edit, Trash2, X, File, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import type { Document } from '@/types/documents';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS, formatFileSize, getFileIcon } from '@/types/documents';

interface DocumentDetailModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onDownload?: (document: Document) => void;
}

export function DocumentDetailModal({
  document,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDownload
}: DocumentDetailModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!document) return null;

  const handleDownload = async () => {
    if (!onDownload) return;
    
    try {
      setIsDownloading(true);
      await onDownload(document);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEdit = () => {
    onEdit?.(document);
  };

  const handleDelete = () => {
    onDelete?.(document);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'requirements': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'meeting_notes': return 'bg-orange-100 text-orange-800';
      case 'reports': return 'bg-indigo-100 text-indigo-800';
      case 'reference': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0 mt-1">
                <span className="text-3xl">{getFileIcon(document.file_type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {document.title}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {document.file_name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getTypeColor(document.document_type)}>
              {DOCUMENT_TYPE_LABELS[document.document_type]}
            </Badge>
            <Badge className={getStatusColor(document.status)}>
              {DOCUMENT_STATUS_LABELS[document.status]}
            </Badge>
            <Badge variant="outline">
              Version {document.version_number}
            </Badge>
          </div>

          {/* Description */}
          {document.description && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{document.description}</p>
            </div>
          )}

          {/* File Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">File Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Size: {formatFileSize(document.file_size)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Type: {document.file_type}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Document Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  Uploaded {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                </span>
              </div>
              
              {document.updated_at !== document.created_at && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                  </span>
                </div>
              )}
              
              {document.author && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Author: {document.author}</span>
                </div>
              )}
              
              {document.download_count > 0 && (
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Downloaded {document.download_count} time{document.download_count !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              {document.last_accessed_at && (
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Last accessed {formatDistanceToNow(new Date(document.last_accessed_at), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
            
            {onEdit && (
              <Button
                variant="outline"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
