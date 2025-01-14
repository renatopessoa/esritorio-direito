import { AuthResponse } from '../../types/models';
import api from '../../lib/axios';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password
    });
    return response.data;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};