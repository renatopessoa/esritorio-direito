import { supabase } from '../config';
import type { ClientDocument } from '../../types/client';

export async function listClientDocuments(clientId: string): Promise<ClientDocument[]> {
  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing client documents:', error);
    throw error;
  }

  return data || [];
}

export async function deleteClientDocument(documentId: string): Promise<void> {
  const { error } = await supabase
    .from('client_documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    console.error('Error deleting client document:', error);
    throw error;
  }
}