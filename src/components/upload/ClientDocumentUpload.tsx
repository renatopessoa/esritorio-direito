import React from 'react';
import { FileUpload } from './FileUpload';
import { Card } from '../ui/Card';
import { uploadClientDocument } from '../../services/api/upload';
import { toast } from 'sonner';

interface ClientDocumentUploadProps {
  clientId?: string;
  onUploadComplete?: () => void;
}

export function ClientDocumentUpload({ clientId, onUploadComplete }: ClientDocumentUploadProps) {
  const handleUpload = async (files: File[]) => {
    if (!clientId) {
      toast.error('Salve o cliente antes de fazer upload de documentos');
      return;
    }

    try {
      const uploadPromises = files.map(file => uploadClientDocument(clientId, file));
      await Promise.all(uploadPromises);
      toast.success('Documentos enviados com sucesso!');
      onUploadComplete?.();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao enviar documentos. Tente novamente.');
    }
  };

  return (
    <Card title="Documentos">
      <FileUpload
        onUpload={handleUpload}
        maxFiles={5}
        maxSize={5 * 1024 * 1024} // 5MB
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        label="Documentos do Cliente"
        helpText="Arraste arquivos ou clique para selecionar (máx. 5MB por arquivo)"
      />
    </Card>
  );
}