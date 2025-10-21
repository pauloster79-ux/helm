import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentCard } from './DocumentCard';
import { useDocuments } from '@/hooks/useDocuments';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Document, DocumentFilter } from '@/types/documents';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from '@/types/documents';

interface DocumentsListProps {
  projectId: string;
  onViewDocument?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
  onDeleteDocument?: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
  showActions?: boolean;
  className?: string;
}

export function DocumentsList({ 
  projectId, 
  onViewDocument, 
  onEditDocument, 
  onDeleteDocument, 
  onDownloadDocument,
  showActions = true,
  className 
}: DocumentsListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<DocumentFilter>({
    document_type: 'all',
    status: 'all',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  const { documents, loading, error, refreshDocuments } = useDocuments({ projectId, filter });

  const handleFilterChange = (key: keyof DocumentFilter, value: string) => {
    setFilter(prev => ({
      ...prev,
      [key]: value === 'all' ? 'all' : value
    }));
  };

  const handleSearchChange = (search: string) => {
    setFilter(prev => ({
      ...prev,
      search: search.trim() || undefined
    }));
  };

  const clearFilters = () => {
    setFilter({
      document_type: 'all',
      status: 'all',
      search: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={refreshDocuments} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const hasActiveFilters = filter.document_type !== 'all' || 
                          filter.status !== 'all' || 
                          filter.search;

  return (
    <div className={className}>
      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={filter.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by:</span>
          </div>

          <Select
            value={filter.document_type || 'all'}
            onValueChange={(value) => handleFilterChange('document_type', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={`${filter.sort_by}-${filter.sort_order}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              setFilter(prev => ({
                ...prev,
                sort_by: sortBy as DocumentFilter['sort_by'],
                sort_order: sortOrder as DocumentFilter['sort_order']
              }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest First</SelectItem>
              <SelectItem value="created_at-asc">Oldest First</SelectItem>
              <SelectItem value="updated_at-desc">Recently Updated</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
              <SelectItem value="file_size-desc">Largest First</SelectItem>
              <SelectItem value="file_size-asc">Smallest First</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {documents.length} document{documents.length !== 1 ? 's' : ''} found
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>

      {/* Documents Grid/List */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'No documents match your filters' : 'No documents yet'}
          </h3>
          <p className="text-gray-600">
            {hasActiveFilters 
              ? 'Try adjusting your search or filters'
              : 'Upload your first document to get started'
            }
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={onViewDocument}
              onEdit={onEditDocument}
              onDelete={onDeleteDocument}
              onDownload={onDownloadDocument}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
