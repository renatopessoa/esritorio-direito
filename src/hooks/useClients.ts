import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService, type CreateClientData } from '../services/clientService';

export const useClients = () => {
  const queryClient = useQueryClient();

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients()
  });

  const createClientMutation = useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientData> }) =>
      clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients: clientsQuery.data?.data || [],
    isLoading: clientsQuery.isLoading,
    error: clientsQuery.error,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
};