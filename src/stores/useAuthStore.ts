import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase/config';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'assistant';
  created_at?: string;
}

const mapRole = (dbRole: 'ADMIN' | 'LAWYER' | 'ASSISTANT'): 'admin' | 'lawyer' | 'assistant' => {
  switch (dbRole) {
    case 'ADMIN':
      return 'admin';
    case 'LAWYER':
      return 'lawyer';
    case 'ASSISTANT':
      return 'assistant';
    default:
      return 'assistant';
  }
};

interface AuthStore {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            if (error.message === 'Invalid login credentials') {
              throw new Error('Email ou senha inválidos');
            }
            throw new Error(error.message);
          }

          if (data.user && data.session) {
            // Buscar dados do usuário na tabela users
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (userError && userError.code !== 'PGRST116') { // PGRST116 = não encontrado
              console.error('Error fetching user data:', userError);
            }

            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              name: userData?.name || data.user.user_metadata?.name || '',
              role: userData?.role ? mapRole(userData.role) : 'assistant',
              created_at: userData?.created_at,
            };

            set({ 
              user, 
              session: data.session, 
              isAuthenticated: true,
              isLoading: false 
            });
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ 
            user: null, 
            session: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        } catch (error: any) {
          console.error('Logout error:', error);
        }
      },

      register: async (email: string, password: string, userData: Partial<User>) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData,
            }
          });

          if (error) throw new Error(error.message);

          if (data.user) {
            // Mapear role para o formato do banco
            const dbRole = userData.role ? userData.role.toUpperCase() as 'ADMIN' | 'LAWYER' | 'ASSISTANT' : 'ASSISTANT';
            
            // Criar registro na tabela users
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email!,
                  name: userData.name || '',
                  role: dbRole,
                  cpf: '', // Temporário - será preenchido no formulário
                  birth_date: '1990-01-01', // Temporário - será preenchido no formulário
                  phone: '', // Temporário - será preenchido no formulário
                  position: userData.role || 'assistant', // Temporário
                }
              ]);

            if (insertError) {
              console.error('Error creating user record:', insertError);
            }
          }

          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Auth check error:', error);
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          if (session?.user) {
            // Buscar dados do usuário na tabela users
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError && userError.code !== 'PGRST116') {
              console.error('Error fetching user data:', userError);
            }

            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: userData?.name || session.user.user_metadata?.name || '',
              role: userData?.role ? mapRole(userData.role) : 'assistant',
              created_at: userData?.created_at,
            };

            set({ 
              user, 
              session, 
              isAuthenticated: true,
              isLoading: false 
            });
          } else {
            set({ 
              user: null, 
              session: null, 
              isAuthenticated: false,
              isLoading: false 
            });
          }
        } catch (error: any) {
          console.error('Auth check error:', error);
          set({ 
            user: null, 
            session: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        }
      },

      updateUser: async (userData: Partial<User>) => {
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('Usuário não autenticado');

          const { error } = await supabase
            .from('users')
            .update(userData)
            .eq('id', currentUser.id);

          if (error) throw new Error(error.message);

          set({ 
            user: { ...currentUser, ...userData } 
          });
        } catch (error: any) {
          console.error('Update user error:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);