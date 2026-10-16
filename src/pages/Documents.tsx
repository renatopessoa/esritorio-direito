import { useEffect, useState } from 'react';
import { Download, FileText, Search, Trash2, Briefcase, User } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { documentService, type DocumentItem } from '../services/documentService';
import { getErrorMessage } from '../lib/axios';
import { formatFileSize } from '../utils/file';
import { formatShortDate } from '../utils/date';

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Busca no servidor com debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        setDocuments(await documentService.listAll(search.trim()));
      } catch (error) {
        toast.error(getErrorMessage(error, 'Erro ao carregar documentos'));
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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
      setDocuments((current) => current.filter((d) => !(d.id === doc.id && d.kind === doc.kind)));
      toast.success('Documento excluído');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir documento'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Documentos</h1>
        <p className="text-sm text-gray-400 mt-1">
          Para enviar arquivos, abra o processo (Processos → Detalhes) ou o cliente (Clientes → Editar).
        </p>
      </div>

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por arquivo, cliente ou nº do processo..."
            className="input-dark w-full pl-10 pr-4 py-2 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th className="text-left py-3 px-4">Arquivo</th>
                <th className="text-left py-3 px-4">Vinculado a</th>
                <th className="text-left py-3 px-4">Tamanho</th>
                <th className="text-left py-3 px-4">Enviado em</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {documents.map((doc) => (
                <tr key={`${doc.kind}-${doc.id}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                      <span className="break-all">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      {doc.kind === 'process' ? (
                        <Briefcase className="w-4 h-4 text-gray-400" aria-label="Processo" />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" aria-label="Cliente" />
                      )}
                      {doc.owner?.label}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{formatFileSize(doc.size)}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{formatShortDate(doc.uploadedAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleDownload(doc)}
                        className="p-2 hover:bg-white/5 rounded-lg"
                        aria-label={`Baixar ${doc.name}`}
                      >
                        <Download className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc)}
                        className="p-2 hover:bg-white/5 rounded-lg"
                        aria-label={`Excluir ${doc.name}`}
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    {isLoading ? 'Carregando...' : search ? 'Nenhum documento encontrado' : 'Nenhum documento enviado ainda'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
