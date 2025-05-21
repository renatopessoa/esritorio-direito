import React, { useState } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ClientForm } from '../../components/clients/ClientForm';
import { api } from '../../services/api';
import { toast } from 'sonner';

export const NewClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<File[]>([]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Primeiro, cria o cliente
      const client = await api.clients.createClient({ ...data, role: 'client' });

      // Se houver documentos, faz o upload
      if (documents.length > 0) {
        const formData = new FormData();
        documents.forEach(doc => {
          formData.append('documents', doc);
        });

        // Associa os documentos ao cliente criado
        await api.documents.uploadClientDocuments(client.id, formData);
      }

      return client;
    },
    onSuccess: () => {
      toast.success('Cliente criado com sucesso!');
      navigate('/clients');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar cliente: ${error.message || 'Erro desconhecido'}`);
    }
  });

  const handleSubmit = (data: any) => {
    return mutation.mutateAsync(data);
  };

  const handleDocumentsChange = (files: File[]) => {
    setDocuments(files);
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Novo Cliente
      </Typography>
      <Paper sx={{ p: 4, mt: 4 }}>
        <ClientForm
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
          onCancel={handleCancel}
          onDocumentsChange={handleDocumentsChange}
        />
      </Paper>
    </div>
  );
};