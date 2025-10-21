import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import type { DocumentUpload, DocumentType, DocumentStatus } from '@/types/documents';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS, formatFileSize, validateFile } from '@/types/documents';

interface DocumentUploadProps {
  projectId: string;
  onUploadComplete?: () => void;
  className?: string;
}

export function DocumentUpload({ projectId, onUploadComplete, className }: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileMetadata, setFileMetadata] = useState<Record<string, { title: string; description: string; documentType: DocumentType; status: DocumentStatus; author: string }>>({});
  const [isUploading, setIsUploading] = useState(false);

  const { uploadProgress, uploadMultipleDocuments, clearUploadProgress, removeUploadProgress } = useDocumentUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter(file => {
      const error = validateFile(file);
      return !error; // Only add valid files
    });
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Initialize metadata for new files
    newFiles.forEach(file => {
      if (!fileMetadata[file.name]) {
        setFileMetadata(prev => ({
          ...prev,
          [file.name]: {
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: '',
            documentType: 'other',
            status: 'draft',
            author: ''
          }
        }));
      }
    });
  }, [fileMetadata]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const handleMetadataChange = (fileName: string, field: string, value: string) => {
    setFileMetadata(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value
      }
    }));
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(prev => prev.filter(f => f.name !== fileName));
    setFileMetadata(prev => {
      const newMetadata = { ...prev };
      delete newMetadata[fileName];
      return newMetadata;
    });
    removeUploadProgress(selectedFiles.find(f => f.name === fileName)!);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      
      const uploads: DocumentUpload[] = selectedFiles.map(file => ({
        file,
        title: fileMetadata[file.name].title,
        description: fileMetadata[file.name].description || undefined,
        document_type: fileMetadata[file.name].documentType,
        status: fileMetadata[file.name].status,
        author: fileMetadata[file.name].author || undefined
      }));

      await uploadMultipleDocuments(uploads, projectId);
      
      // Clear selections after successful upload
      setSelectedFiles([]);
      setFileMetadata({});
      clearUploadProgress();
      
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getUploadStatus = (fileName: string) => {
    const progress = uploadProgress.find(p => p.file.name === fileName);
    return progress?.status || 'pending';
  };

  const getUploadProgress = (fileName: string) => {
    const progress = uploadProgress.find(p => p.file.name === fileName);
    return progress?.progress || 0;
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Upload documents'}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supported: PDF, DOC, DOCX, TXT, MD, JPG, PNG (max 10MB each)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Selected Files</h3>
          
          {selectedFiles.map(file => {
            const metadata = fileMetadata[file.name];
            const uploadStatus = getUploadStatus(file.name);
            const uploadProgressValue = getUploadProgress(file.name);
            
            return (
              <Card key={file.name}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    {uploadStatus !== 'uploading' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.name)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {uploadStatus === 'uploading' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Uploading...</span>
                        <span className="text-sm text-gray-500">{uploadProgressValue}%</span>
                      </div>
                      <Progress value={uploadProgressValue} className="h-2" />
                    </div>
                  )}

                  {uploadStatus === 'error' && (
                    <div className="mb-4 flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Upload failed</span>
                    </div>
                  )}

                  {uploadStatus === 'completed' && (
                    <div className="mb-4 flex items-center space-x-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Upload completed</span>
                    </div>
                  )}

                  {/* Metadata Form */}
                  {uploadStatus === 'pending' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${file.name}`}>Title</Label>
                        <Input
                          id={`title-${file.name}`}
                          value={metadata.title}
                          onChange={(e) => handleMetadataChange(file.name, 'title', e.target.value)}
                          placeholder="Document title"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`type-${file.name}`}>Document Type</Label>
                        <Select
                          value={metadata.documentType}
                          onValueChange={(value) => handleMetadataChange(file.name, 'documentType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`status-${file.name}`}>Status</Label>
                        <Select
                          value={metadata.status}
                          onValueChange={(value) => handleMetadataChange(file.name, 'status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`author-${file.name}`}>Author</Label>
                        <Input
                          id={`author-${file.name}`}
                          value={metadata.author}
                          onChange={(e) => handleMetadataChange(file.name, 'author', e.target.value)}
                          placeholder="Document author"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor={`description-${file.name}`}>Description</Label>
                        <Textarea
                          id={`description-${file.name}`}
                          value={metadata.description}
                          onChange={(e) => handleMetadataChange(file.name, 'description', e.target.value)}
                          placeholder="Document description (optional)"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
          {/* Upload Button */}
          {selectedFiles.length > 0 && !isUploading && (
            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={isUploading}>
                Upload {selectedFiles.length} Document{selectedFiles.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
