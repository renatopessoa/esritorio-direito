import { supabase } from '../lib/supabase/config';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Email ou senha inválidos');
      }
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Erro ao fazer login');
  }
}

export async function signUp(email: string, password: string, userData: any) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Erro ao criar conta');
  }
}