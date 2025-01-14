import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  label?: string;
  helpText?: string;
}

export function FileUpload({
  onUpload,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  label = 'Upload de Arquivos',
  helpText = 'Arraste arquivos ou clique para selecionar'
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!accept.split(',').some(type => file.name.toLowerCase().endsWith(type))) {
      return 'Formato de arquivo não suportado';
    }
    if (file.size > maxSize) {
      return 'Arquivo muito grande';
    }
    return null;
  };

  const handleFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(files);
      setFiles([]);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={`
            input-dark w-full min-h-[100px] flex flex-col items-center justify-center p-4
            border-2 border-dashed rounded-lg transition-colors cursor-pointer
            ${isDragging ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'}
          `}
        >
          <input
            type="file"
            multiple
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-300">
              {helpText}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Formatos aceitos: {accept} • Máximo {formatFileSize(maxSize)}
            </p>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 glass-card rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Enviando...' : 'Enviar Documentos'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}