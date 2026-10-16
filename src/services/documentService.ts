import api from '../lib/axios';

export type DocumentKind = 'client' | 'process';

/** Documento num formato único, seja de cliente ou de processo. */
export interface DocumentItem {
  id: string;
  kind: DocumentKind;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  owner?: { id: string; label: string };
}

interface ClientDocumentResponse {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

interface ProcessDocumentResponse {
  id: string;
  title: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILES = 5;
export const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.xls,.xlsx,.odt,.txt,.jpg,.jpeg,.png';

const basePath = (kind: DocumentKind, ownerId: string) =>
  kind === 'client' ? `/clients/${ownerId}/documents` : `/processes/${ownerId}/documents`;

function normalize(kind: DocumentKind, doc: ClientDocumentResponse | ProcessDocumentResponse): DocumentItem {
  return 'title' in doc
    ? { id: doc.id, kind, name: doc.title, type: doc.type, size: doc.size, uploadedAt: doc.uploadedAt }
    : { id: doc.id, kind, name: doc.name, type: doc.type, size: doc.size, uploadedAt: doc.createdAt };
}

export const documentService = {
  /** Todos os documentos do escritório (tela Documentos). */
  async listAll(search?: string): Promise<DocumentItem[]> {
    const { data } = await api.get<DocumentItem[]>('/documents', { params: { search: search || undefined } });
    return data;
  },

  async list(kind: DocumentKind, ownerId: string): Promise<DocumentItem[]> {
    const { data } = await api.get<Array<ClientDocumentResponse | ProcessDocumentResponse>>(basePath(kind, ownerId));
    return data.map((doc) => normalize(kind, doc));
  },

  async upload(kind: DocumentKind, ownerId: string, files: File[]): Promise<DocumentItem[]> {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    const { data } = await api.post<Array<ClientDocumentResponse | ProcessDocumentResponse>>(
      basePath(kind, ownerId),
      form,
      // Deixa o navegador definir o boundary do multipart
      { headers: { 'Content-Type': undefined }, timeout: 120000 },
    );
    return data.map((doc) => normalize(kind, doc));
  },

  /** Baixa com o token de login e dispara o download no navegador. */
  async download(doc: Pick<DocumentItem, 'id' | 'kind' | 'name'>): Promise<void> {
    const { data } = await api.get<Blob>(`/documents/${doc.kind}/${doc.id}/download`, {
      responseType: 'blob',
      timeout: 120000,
    });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  async remove(doc: Pick<DocumentItem, 'id' | 'kind'>): Promise<void> {
    await api.delete(`/documents/${doc.kind}/${doc.id}`);
  },
};
