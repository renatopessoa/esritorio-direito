import axios from 'axios';
import { toast } from 'sonner';

// Cria uma instância do axios com configurações base
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar token de autenticação
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Erro de conexão. Verifique sua internet.');
      return Promise.reject(new Error('Erro de conexão'));
    }

    if (error.response.status === 401) {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
      return Promise.reject(new Error('Sessão expirada'));
    }

    if (error.response.status === 403) {
      toast.error('Você não tem permissão para realizar esta ação');
      return Promise.reject(new Error('Acesso negado'));
    }

    if (error.response.status === 404) {
      toast.error('Recurso não encontrado');
      return Promise.reject(new Error('Recurso não encontrado'));
    }

    if (error.response.status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente mais tarde.');
      return Promise.reject(new Error('Erro do servidor'));
    }

    return Promise.reject(error);
  }
);

// Serviços de API organizados por domínio
const clients = {
  createClient: async (clientData: any) => {
    const response = await axiosInstance.post('/clients', clientData);
    return response.data;
  },
  getClients: async () => {
    const response = await axiosInstance.get('/clients');
    return response.data;
  },
  getClient: async (id: number) => {
    const response = await axiosInstance.get(`/clients/${id}`);
    return response.data;
  },
  updateClient: async (id: number, clientData: any) => {
    const response = await axiosInstance.put(`/clients/${id}`, clientData);
    return response.data;
  },
  deleteClient: async (id: number) => {
    const response = await axiosInstance.delete(`/clients/${id}`);
    return response.data;
  },
};

const documents = {
  uploadClientDocuments: async (clientId: number, formData: FormData) => {
    const response = await axiosInstance.post(`/clients/${clientId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getClientDocuments: async (clientId: number) => {
    const response = await axiosInstance.get(`/clients/${clientId}/documents`);
    return response.data;
  },

  deleteDocument: async (documentId: number) => {
    const response = await axiosInstance.delete(`/documents/${documentId}`);
    return response.data;
  }
};

const jurimetry = {
  analyzeCase: async (caseData: any) => {
    const response = await axiosInstance.post('/jurimetry/analyze', caseData);
    return response.data;
  },
  
  getCaseAnalysis: async (id: number) => {
    const response = await axiosInstance.get(`/jurimetry/cases/${id}`);
    return response.data;
  },
  
  getClientAnalyses: async (clientId: number) => {
    const response = await axiosInstance.get(`/jurimetry/client/${clientId}/analyses`);
    return response.data;
  },
  
  getJudges: async (court?: string, courtSection?: string) => {
    const params = new URLSearchParams();
    if (court) params.append('court', court);
    if (courtSection) params.append('courtSection', courtSection);
    
    const response = await axiosInstance.get(`/jurimetry/judges?${params.toString()}`);
    return response.data;
  },
  
  updateJudgeProfile: async (judgeId: number, profileData: any) => {
    const response = await axiosInstance.put(`/jurimetry/judges/${judgeId}/profile`, profileData);
    return response.data;
  }
};

// API exportada com todos os serviços
export const api = {
  clients,
  documents,
  jurimetry,
  // Outros serviços podem ser adicionados aqui
};