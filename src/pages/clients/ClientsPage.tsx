import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Plus } from 'lucide-react';
import { ClientList } from '../../components/clients/ClientList';
import { useNavigate } from 'react-router-dom';

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={() => navigate('/clients/new')}
        >
          New Client
        </Button>
      </Box>
      <ClientList clients={[]} />
    </div>
  );
};