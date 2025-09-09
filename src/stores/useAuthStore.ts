import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/api/auth'
import type { RegisterData, AuthUser } from '../lib/auth'

interface UpdateProfileData {
  name?: string
  email?: string
  password?: string
  phone?: string
  landline?: string
  position?: string
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

interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          const { user, token } = await authService.login({ email, password })
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true })
          
          const { user, token } = await authService.register(data)
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        authService.logout()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      checkAuth: async () => {
        const { token } = get()
        
        if (!token) {
          set({ isAuthenticated: false })
          return
        }

        try {
          const user = await authService.verifyToken(token)
          set({
            user,
            isAuthenticated: true,
          })
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },

      updateProfile: async (data: UpdateProfileData) => {
        const { user } = get()
        if (!user) throw new Error('Usuário não autenticado')

        try {
          set({ isLoading: true })
          
          const updatedUser = await authService.updateProfile(user.id, data)
          
          set({
            user: updatedUser,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)