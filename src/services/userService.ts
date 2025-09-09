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

interface CreateUserData {
  name: string
  email: string
  password: string
  role: string
  cpf: string
  birthDate: string
  phone: string
  landline?: string
  position: string
  address?: {
    zipCode: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  cpf: string
  birthDate: string
  phone: string
  landline?: string
  position: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

class UserService {
  // Criar usuário
  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await axiosInstance.post<User>('/users', data)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao criar usuário')
    }
  }

  // Listar usuários
  async getUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>('/users')
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao buscar usuários')
    }
  }

  // Buscar usuário por ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`/users/${id}`)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao buscar usuário')
    }
  }

  // Atualizar usuário
  async updateUser(id: string, data: Partial<CreateUserData>): Promise<User> {
    try {
      const response = await axiosInstance.put<User>(`/users/${id}`, data)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao atualizar usuário')
    }
  }

  // Deletar usuário
  async deleteUser(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/users/${id}`)
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao deletar usuário')
    }
  }

  // Ativar/desativar usuário
  async toggleUserStatus(id: string, active: boolean): Promise<User> {
    try {
      const response = await axiosInstance.patch<User>(`/users/${id}/status`, { active })
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao alterar status do usuário')
    }
  }
}

export const userService = new UserService()
export const createUser = userService.createUser.bind(userService)
export type { User, CreateUserData }
