import { User } from '../../types/models';
import api from '../../lib/axios';

export const clientService = {
  getClients: async () => {
    const response = await api.get<User[]>('/api/clients');
    return response.data;
  },

  getClient: async (id: string) => {
    const response = await api.get<User>(`/api/clients/${id}`);
    return response.data;
  },

  createClient: async (data: Partial<User>) => {
    const response = await api.post<User>('/api/clients', {
      ...data,
      role: 'client'
    });
    return response.data;
  },

  updateClient: async (id: string, data: Partial<User>) => {
    const response = await api.put<User>(`/api/clients/${id}`, data);
    return response.data;
  },

  deleteClient: async (id: string) => {
    await api.delete(`/api/clients/${id}`);
  }
};