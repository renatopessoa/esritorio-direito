import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'assistant';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simular validação de login
        if (email === 'admin' && password === 'admin') {
          const user = {
            id: '1',
            name: 'Administrador',
            email: 'admin',
            role: 'admin' as const,
          };
          set({ user, token: 'fake-token', isAuthenticated: true });
        } else {
          throw new Error('Credenciais inválidas');
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);