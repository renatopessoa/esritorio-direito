import { useCallback, useEffect, useState } from 'react';
import { Download, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/Card';
import { FileUpload } from '../upload/FileUpload';
import {
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_FILES,
  documentService,
  type DocumentItem,
  type DocumentKind,
} from '../../services/documentService';
import { getErrorMessage } from '../../lib/axios';
import { formatFileSize } from '../../utils/file';
import { formatDateTime } from '../../utils/date';

interface DocumentsPanelProps {
  kind: DocumentKind;
  ownerId: string;
}

/** Lista, envio, download e exclusão de documentos de um cliente ou processo. */
export function DocumentsPanel({ kind, ownerId }: DocumentsPanelProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setDocuments(await documentService.list(kind, ownerId));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao carregar documentos'));
    } finally {
      setIsLoading(false);
    }
  }, [kind, ownerId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (files: File[]) => {
    try {
      const uploaded = await documentService.upload(kind, ownerId, files);
      setDocuments((current) => [...uploaded, ...current]);
      toast.success(uploaded.length === 1 ? 'Documento enviado' : `${uploaded.length} documentos enviados`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao enviar documentos'));
      throw error;
    }
  };

  const handleDownload = async (doc: DocumentItem) => {
    try {
      await documentService.download(doc);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao baixar documento'));
    }
  };

  const handleDelete = async (doc: DocumentItem) => {
    if (!window.confirm(`Excluir o documento "${doc.name}"?`)) return;
    try {
      await documentService.remove(doc);
      setDocuments((current) => current.filter((d) => d.id !== doc.id));
      toast.success('Documento excluído');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir documento'));
    }
  };

  return (
    <Card title="Documentos">
      <div className="space-y-6">
        <FileUpload
          onUpload={handleUpload}
          maxFiles={MAX_FILES}
          maxSize={MAX_FILE_SIZE}
          accept={ACCEPTED_EXTENSIONS}
          label="Enviar documentos"
          helpText="Arraste arquivos ou clique para selecionar"
        />

        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 glass-card rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(doc.size)} • {formatDateTime(doc.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label={`Baixar ${doc.name}`}
                >
                  <Download className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(doc)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label={`Excluir ${doc.name}`}
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <p className="text-center py-4 text-gray-400">
              {isLoading ? 'Carregando...' : 'Nenhum documento anexado'}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
