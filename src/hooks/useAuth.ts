import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { authService } from '../services/api';
import { useAuthStore } from '../store/auth';

export const useAuth = () => {
  const { user, token, setAuth, logout: clearAuth } = useAuthStore();

  const loginMutation = useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const response = await authService.login(email, password);
      return response;
    },
    {
      onSuccess: (data) => {
        setAuth(data.user, data.token);
      },
    }
  );

  const logout = useCallback(() => {
    authService.logout();
    clearAuth();
  }, [clearAuth]);

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isLoading,
    error: loginMutation.error,
  };
};