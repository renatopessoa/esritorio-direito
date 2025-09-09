import React from 'react';
import { FileUpload } from '../upload/FileUpload';
import { Card } from '../ui/Card';
import { uploadClientDocument } from '../../services/api/upload';
import { toast } from 'sonner';

interface ClientDocumentUploadProps {
  clientId?: string;
  onUpload?: (documents: Array<{ url: string; name: string; size: number; type: string }>) => void;
}

export function ClientDocumentUpload({ clientId, onUpload }: ClientDocumentUploadProps) {
  const handleUpload = async (files: File[]) => {
    if (!clientId) {
      toast.error('Salve o cliente antes de fazer upload de documentos');
      return;
    }

    try {
      const uploadedDocs = await Promise.all(
        files.map(file => uploadClientDocument(clientId, file))
      );

      onUpload?.(uploadedDocs);
      toast.success('Documentos enviados com sucesso!');
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
      />
    </Card>
  );
}