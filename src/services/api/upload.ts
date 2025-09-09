import { toast } from 'sonner';

export interface UploadResult {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadClientDocument = async (_clientId: string, file: File): Promise<UploadResult> => {
  // Por enquanto, vamos simular o upload
  // Em uma implementação real, você poderia usar um serviço como AWS S3, 
  // Google Cloud Storage ou armazenar os arquivos localmente
  // clientId será usado quando implementarmos persistência real

  return new Promise((resolve) => {
    setTimeout(() => {
      const result: UploadResult = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url: `#`, // URL placeholder
        size: file.size,
        type: file.type,
      };

      toast.success(`Documento ${file.name} carregado com sucesso!`);
      resolve(result);
    }, 1000);
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteClientDocument = async (_documentId: string): Promise<void> => {
  // Simulação de exclusão
  // documentId será usado quando implementarmos persistência real
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success('Documento excluído com sucesso!');
      resolve();
    }, 500);
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getClientDocuments = async (_clientId: string): Promise<UploadResult[]> => {
  // Simulação de listagem de documentos
  // clientId será usado quando implementarmos persistência real
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
};
