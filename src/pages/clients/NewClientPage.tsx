import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ClientForm } from '../../components/clients/ClientForm';
import { api } from '../../services/api';

export const NewClientPage: React.FC = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: api.clients.createClient,
    onSuccess: () => {
      navigate('/clients');
    },
  });

  const handleSubmit = (data: any) => {
    return mutation.mutateAsync({ ...data, role: 'client' });
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        New Client
      </Typography>
      <Paper sx={{ p: 4, mt: 4 }}>
        <ClientForm
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
        />
      </Paper>
    </div>
  );
};