import { supabase } from '../config';
import type { UserFormData } from '../../types/user';
import { toast } from 'sonner';

export async function createUser(data: UserFormData) {
  try {
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role,
        },
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      if (authError.message.includes('email')) {
        throw new Error('Este email já está em uso');
      }
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Falha ao criar usuário');
    }

    // Generate registration number
    const registrationNumber = `${data.role.substring(0, 3).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: data.name,
        email: data.email,
        role: data.role,
        cpf: data.cpf.replace(/\D/g, ''),
        birth_date: data.birthDate,
        phone: data.phone.replace(/\D/g, ''),
        landline: data.landline?.replace(/\D/g, '') || null,
        address: data.address,
        position: data.position,
        registration_number: registrationNumber,
        active: true
      })
      .select()
      .single();

    if (profileError) {
      // If profile creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      if (profileError.code === '23505') {
        if (profileError.message.includes('users_email_key')) {
          throw new Error('Este email já está cadastrado');
        }
        if (profileError.message.includes('users_cpf_key')) {
          throw new Error('Este CPF já está cadastrado');
        }
      }
      
      throw new Error('Erro ao criar perfil do usuário');
    }

    return profile;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw error;
  }
}