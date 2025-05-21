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

// API exportada com todos os serviços
export const api = {
  clients,
  // Outros serviços podem ser adicionados aqui
};