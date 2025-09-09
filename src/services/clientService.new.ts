import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor para adicionar token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface Address {
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

interface CreateClientData {
  name: string
  documentId: string
  email: string
  phone: string
  address: Address
  notes?: string
}

interface UpdateClientData extends Partial<CreateClientData> {
  id?: string
}

interface ClientDocument {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: string
}

interface Client {
  id: string
  name: string
  documentId: string
  email: string
  phone: string
  address: Address
  notes?: string
  createdAt: string
  updatedAt: string
}

interface ClientWithDocuments extends Client {
  documents: ClientDocument[]
  _count: {
    processes: number
    documents: number
  }
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

interface GetClientsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface GetClientsResponse {
  data: ClientWithDocuments[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

class ClientService {
  // Listar clientes com paginação e busca
  async getClients(params: GetClientsParams = {}): Promise<GetClientsResponse> {
    try {
      const response = await axiosInstance.get<GetClientsResponse>('/clients', { params })
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao buscar clientes')
    }
  }

  // Buscar cliente por ID
  async getClientById(id: string): Promise<ClientWithDocuments> {
    try {
      const response = await axiosInstance.get<ClientWithDocuments>(`/clients/${id}`)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao buscar cliente')
    }
  }

  // Criar cliente
  async createClient(data: CreateClientData): Promise<Client> {
    try {
      const response = await axiosInstance.post<Client>('/clients', data)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao criar cliente')
    }
  }

  // Atualizar cliente
  async updateClient(id: string, data: UpdateClientData): Promise<Client> {
    try {
      const response = await axiosInstance.put<Client>(`/clients/${id}`, data)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao atualizar cliente')
    }
  }

  // Deletar cliente
  async deleteClient(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/clients/${id}`)
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao deletar cliente')
    }
  }

  // Upload de documento
  async uploadDocument(clientId: string, formData: FormData): Promise<ClientDocument> {
    try {
      const response = await axiosInstance.post<ClientDocument>(
        `/clients/${clientId}/documents`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao fazer upload do documento')
    }
  }

  // Deletar documento
  async deleteDocument(documentId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/documents/${documentId}`)
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao deletar documento')
    }
  }

  // Obter estatísticas
  async getStatistics(): Promise<{
    total: number
    thisMonth: number
    lastMonth: number
  }> {
    try {
      const response = await axiosInstance.get('/clients/statistics')
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao buscar estatísticas')
    }
  }
}

export const clientService = new ClientService()
export type { Client, ClientWithDocuments, CreateClientData, UpdateClientData, ClientDocument, Address }
