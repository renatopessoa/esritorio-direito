import { FileText, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { FileUpload } from '../upload/FileUpload';
import { formatFileSize } from '../../utils/file';
import { formatDate } from '../../utils/date';
import type { ClientDocument } from '../../services/clientService';

interface ClientDocumentsProps {
  documents: ClientDocument[];
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

export function ClientDocuments({
  documents,
  onUpload,
  onDelete
}: ClientDocumentsProps) {
  return (
    <Card title="Documentos">
      <div className="space-y-6">
        <FileUpload
          onUpload={onUpload}
          maxFiles={5}
          maxSize={10 * 1024 * 1024} // 10MB
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          label="Upload de Documentos"
          helpText="Arraste arquivos ou clique para selecionar (máx. 10MB por arquivo)"
        />

        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 glass-card rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">{doc.fileName}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(doc.fileSize)} • Enviado em {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDelete(doc.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <p className="text-center py-4 text-gray-400">
              Nenhum documento anexado
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}