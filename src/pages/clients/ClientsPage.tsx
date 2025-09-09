import React from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import { Plus } from 'lucide-react';
import { ClientList } from '../../components/clients/ClientList';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../services/clientService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../../services/api';

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Carregar lista de clientes
  const {
    data: clients = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients'],
    queryFn: api.clients.getClients
  });

  // Handle query errors with useEffect
  React.useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast.error(`Erro ao carregar clientes: ${errorMessage}`);
    }
  }, [error]);

  // Deletar cliente
  const deleteMutation = useMutation({
    mutationFn: api.clients.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente excluído com sucesso');
    },
    onError: (err: Error) => {
      toast.error(`Erro ao excluir cliente: ${err.message || 'Erro desconhecido'}`);
    }
  });

  // Funções de manipulação
  const handleEdit = (client: Client) => {
    navigate(`/clients/edit/${client.id}`);
  };

  const handleDelete = (client: Client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      deleteMutation.mutate(Number(client.id));
    }
  };

  // Renderização condicional
  if (error) {
    return (
      <div className="p-4 text-center">
        <Typography color="error">Erro ao carregar clientes. Tente novamente.</Typography>
        <Button
          variant="outlined"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['clients'] })}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Clientes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={() => navigate('/clients/new')}
        >
          Novo Cliente
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <ClientList
          clients={clients}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};