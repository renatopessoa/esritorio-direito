import { toast } from 'sonner';

export interface UploadResult {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export const uploadClientDocument = async (clientId: string, file: File): Promise<UploadResult> => {
  // Por enquanto, vamos simular o upload
  // Em uma implementação real, você poderia usar um serviço como AWS S3, 
  // Google Cloud Storage ou armazenar os arquivos localmente

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

export const deleteClientDocument = async (documentId: string): Promise<void> => {
  // Simulação de exclusão
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success('Documento excluído com sucesso!');
      resolve();
    }, 500);
  });
};

export const getClientDocuments = async (clientId: string): Promise<UploadResult[]> => {
  // Simulação de listagem de documentos
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
};
