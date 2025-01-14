import { ClientFormData } from '../lib/validation/clientSchema';
import { api } from './api';
import { handleApiError } from '../utils/apiErrors';
import { mockApi } from './mockApi';

// Flag para usar a API mock
const USE_MOCK_API = true;

interface ClientResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export async function createClient(data: ClientFormData): Promise<ClientResponse> {
  try {
    if (USE_MOCK_API) {
      return await mockApi.createClient(data);
    }

    const response = await api.post<ClientResponse>('/clients', {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, {
      409: 'Já existe um cliente cadastrado com este CPF/CNPJ',
      default: 'Erro ao cadastrar cliente. Tente novamente mais tarde.',
    });
  }
}

export async function updateClient(id: string, data: Partial<ClientFormData>): Promise<ClientResponse> {
  try {
    if (USE_MOCK_API) {
      return await mockApi.updateClient(id, data);
    }

    const response = await api.put<ClientResponse>(`/clients/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, {
      404: 'Cliente não encontrado',
      default: 'Erro ao atualizar cliente. Tente novamente mais tarde.',
    });
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    if (USE_MOCK_API) {
      await mockApi.deleteClient(id);
      return;
    }

    await api.delete(`/clients/${id}`);
  } catch (error) {
    throw handleApiError(error, {
      404: 'Cliente não encontrado',
      default: 'Erro ao excluir cliente. Tente novamente mais tarde.',
    });
  }
}

export async function getClient(id: string): Promise<ClientResponse> {
  try {
    if (USE_MOCK_API) {
      return await mockApi.getClient(id);
    }

    const response = await api.get<ClientResponse>(`/clients/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, {
      404: 'Cliente não encontrado',
      default: 'Erro ao buscar cliente. Tente novamente mais tarde.',
    });
  }
}

export async function listClients(): Promise<ClientResponse[]> {
  try {
    if (USE_MOCK_API) {
      return await mockApi.listClients();
    }

    const response = await api.get<ClientResponse[]>('/clients');
    return response.data;
  } catch (error) {
    throw handleApiError(error, {
      default: 'Erro ao listar clientes. Tente novamente mais tarde.',
    });
  }
}