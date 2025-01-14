import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ClientForm } from '../../components/clients/ClientForm';
import { clientService } from '../../services/api';
import { User } from '../../types';

export const NewClientPage: React.FC = () => {
  const navigate = useNavigate();
  const mutation = useMutation(clientService.createClient, {
    onSuccess: () => {
      navigate('/clients');
    },
  });

  const handleSubmit = (data: Partial<User>) => {
    mutation.mutate({ ...data, role: 'client' });
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        New Client
      </Typography>
      <Paper sx={{ p: 4, mt: 4 }}>
        <ClientForm
          onSubmit={handleSubmit}
          isLoading={mutation.isLoading}
        />
      </Paper>
    </div>
  );
};