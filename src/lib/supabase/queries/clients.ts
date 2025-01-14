import { supabase } from '../config';
import type { ClientFormData } from '../../validation/clientSchema';

export async function createClient(data: ClientFormData) {
  try {
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        name: data.name,
        document_id: data.documentId.replace(/\D/g, ''),
        email: data.email,
        phone: data.phone.replace(/\D/g, ''),
        address: data.address,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      if (error.code === '23505') {
        throw new Error('Já existe um cliente com este CPF/CNPJ ou email');
      }
      throw error;
    }

    return client;
  } catch (error: any) {
    console.error('Error in createClient:', error);
    throw error;
  }
}

export async function updateClient(id: string, data: ClientFormData) {
  const { data: client, error } = await supabase
    .from('clients')
    .update({
      name: data.name,
      document_id: data.documentId.replace(/\D/g, ''),
      email: data.email,
      phone: data.phone.replace(/\D/g, ''),
      address: data.address,
      notes: data.notes || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating client:', error);
    if (error.code === '23505') {
      throw new Error('Já existe um cliente com este CPF/CNPJ ou email');
    }
    throw error;
  }

  return client;
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}

export async function listClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error listing clients:', error);
    throw error;
  }

  return data || [];
}