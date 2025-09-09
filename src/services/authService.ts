import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
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

interface AuthUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'LAWYER' | 'ASSISTANT'
  active: boolean
}

interface AuthResponse {
  user: AuthUser
  token: string
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

interface TokenPayload {
  userId: string
  email: string
  role: string
  exp: number
  iat: number
}

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao fazer login')
    }
  }

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', data)
      return response.data
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao fazer cadastro')
    }
  }

  // Verificar token
  async verifyToken(token: string): Promise<AuthUser> {
    try {
      const response = await axiosInstance.get<{ user: AuthUser }>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.user
    } catch {
      throw new Error('Token inválido')
    }
  }

  // Logout (remover token do frontend)
  async logout(): Promise<void> {
    // Remove o token do localStorage
    localStorage.removeItem('token')
  }

  // Atualizar perfil
  async updateProfile(userId: string, data: Partial<RegisterData>): Promise<AuthUser> {
    try {
      const response = await axiosInstance.put<{ user: AuthUser }>(`/auth/profile/${userId}`, data)
      return response.data.user
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.response?.data?.message || 'Erro ao atualizar perfil')
    }
  }

  // Utilitários para token
  getToken(): string | null {
    return localStorage.getItem('token')
  }

  setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  removeToken(): void {
    localStorage.removeItem('token')
  }

  // Decodificar payload do JWT (apenas leitura, sem verificação)
  decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload) as TokenPayload
    } catch {
      return null
    }
  }

  // Verificar se o token está expirado
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  }
}

export const authService = new AuthService()