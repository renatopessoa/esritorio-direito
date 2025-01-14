import { useQuery, useMutation, useQueryClient } from 'react-query';
import { clientService } from '../services/api';
import { User } from '../types/models';

export const useClients = () => {
  const queryClient = useQueryClient();

  const clientsQuery = useQuery<User[]>('clients', clientService.getClients);

  const createClientMutation = useMutation(clientService.createClient, {
    onSuccess: () => {
      queryClient.invalidateQueries('clients');
    },
  });

  const updateClientMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<User> }) =>
      clientService.updateClient(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
      },
    }
  );

  const deleteClientMutation = useMutation(clientService.deleteClient, {
    onSuccess: () => {
      queryClient.invalidateQueries('clients');
    },
  });

  return {
    clients: clientsQuery.data || [],
    isLoading: clientsQuery.isLoading,
    error: clientsQuery.error,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isLoading,
    isUpdating: updateClientMutation.isLoading,
    isDeleting: deleteClientMutation.isLoading,
  };
};