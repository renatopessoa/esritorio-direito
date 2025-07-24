import { supabase } from '../../lib/supabase/config';
import type { UserRole } from '@prisma/client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  cpf: string;
  birthDate: string;
  phone: string;
  landline?: string;
  position: string;
  address?: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  landline?: string;
  position?: string;
  address?: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Buscar dados do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role, active')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      throw new Error('Erro ao buscar dados do usuário');
    }

    return {
      user: userData as AuthUser,
      token: data.session?.access_token || '',
    };
  },

  register: async (registerData: RegisterData) => {
    // Primeiro, criar o usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Erro ao criar usuário');
    }

    // Depois, inserir dados adicionais na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        name: registerData.name,
        email: registerData.email,
        role: registerData.role,
        cpf: registerData.cpf,
        birth_date: registerData.birthDate,
        phone: registerData.phone,
        landline: registerData.landline,
        position: registerData.position,
        address: registerData.address,
        active: true,
      })
      .select('id, name, email, role, active')
      .single();

    if (userError) {
      // Se falhar ao inserir na tabela users, deletar o usuário do auth
      await supabase.auth.admin.deleteUser(data.user.id);
      throw new Error(userError.message);
    }

    return {
      user: userData as AuthUser,
      token: data.session?.access_token || '',
    };
  },

  verifyToken: async (token: string): Promise<AuthUser> => {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new Error('Token inválido');
    }

    // Buscar dados do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role, active')
      .eq('id', user.id)
      .single();

    if (userError) {
      throw new Error('Usuário não encontrado');
    }

    if (!userData.active) {
      throw new Error('Usuário inativo');
    }

    return userData as AuthUser;
  },

  updateProfile: async (userId: string, data: UpdateProfileData): Promise<AuthUser> => {
    const { data: userData, error } = await supabase
      .from('users')
      .update({
        name: data.name,
        phone: data.phone,
        landline: data.landline,
        position: data.position,
        address: data.address,
      })
      .eq('id', userId)
      .select('id, name, email, role, active')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Se está atualizando email ou senha, atualizar no Supabase Auth também
    if (data.email || data.password) {
      const updateData: any = {};
      if (data.email) updateData.email = data.email;
      if (data.password) updateData.password = data.password;

      const { error: authError } = await supabase.auth.updateUser(updateData);
      if (authError) {
        throw new Error(authError.message);
      }
    }

    return userData as AuthUser;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    localStorage.removeItem('token');
  }
};