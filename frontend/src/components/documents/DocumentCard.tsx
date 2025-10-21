import { Download, Eye, Edit, Trash2, File, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { Document } from '@/types/documents';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS, formatFileSize, getFileIcon } from '@/types/documents';

interface DocumentCardProps {
  document: Document;
  onView?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  showActions?: boolean;
}

export function DocumentCard({ 
  document, 
  onView, 
  onEdit, 
  onDelete, 
  onDownload,
  showActions = true 
}: DocumentCardProps) {
  const handleView = () => {
    onView?.(document);
  };

  const handleEdit = () => {
    onEdit?.(document);
  };

  const handleDelete = () => {
    onDelete?.(document);
  };

  const handleDownload = () => {
    onDownload?.(document);
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              <span className="text-2xl">{getFileIcon(document.file_type)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate" title={document.title}>
                {document.title}
              </h3>
              <p className="text-sm text-gray-500 truncate" title={document.file_name}>
                {document.file_name}
              </p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-1">
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleView}
                  className="h-8 w-8 p-0"
                  title="View document"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 w-8 p-0"
                  title="Download document"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0"
                  title="Edit document"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete document"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        {document.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {document.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getTypeColor(document.document_type)}>
            {DOCUMENT_TYPE_LABELS[document.document_type]}
          </Badge>
          <Badge className={getStatusColor(document.status)}>
            {DOCUMENT_STATUS_LABELS[document.status]}
          </Badge>
          <Badge variant="outline">
            v{document.version_number}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4" />
            <span>{formatFileSize(document.file_size)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>
              Uploaded {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {document.author && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>By {document.author}</span>
            </div>
          )}
          
          {document.download_count > 0 && (
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>{document.download_count} download{document.download_count !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
