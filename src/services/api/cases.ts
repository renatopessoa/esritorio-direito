import { Case } from '../../types/models';
import api from '../../lib/axios';

export const caseService = {
  getCases: async () => {
    const response = await api.get<Case[]>('/api/cases');
    return response.data;
  },

  getCase: async (id: string) => {
    const response = await api.get<Case>(`/api/cases/${id}`);
    return response.data;
  },

  createCase: async (data: Partial<Case>) => {
    const response = await api.post<Case>('/api/cases', data);
    return response.data;
  },

  updateCase: async (id: string, data: Partial<Case>) => {
    const response = await api.put<Case>(`/api/cases/${id}`, data);
    return response.data;
  },

  deleteCase: async (id: string) => {
    await api.delete(`/api/cases/${id}`);
  }
};