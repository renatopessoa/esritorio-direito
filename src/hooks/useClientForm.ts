import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { clientSchema, type ClientFormData } from '../lib/validation/clientSchema';
import { createClient, updateClient } from '../services/clientService';
import { useClientStore } from '../stores/useClientStore';
import { useCallback } from 'react';

interface UseClientFormProps {
  initialData?: Partial<ClientFormData>;
  clientId?: string;
}

export function useClientForm({ initialData, clientId }: UseClientFormProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const addClient = useClientStore((state) => state.addClient);
  const updateClientStore = useClientStore((state) => state.updateClient);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });

  const onSubmit = useCallback(async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);

      if (clientId) {
        const updatedClient = await updateClient(clientId, data);
        updateClientStore(clientId, updatedClient);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        const newClient = await createClient(data);
        addClient(newClient);
        toast.success('Cliente cadastrado com sucesso!');
      }

      navigate('/app/clients');
    } catch (error) {
      if (error.message.includes('CPF/CNPJ')) {
        setError('documentId', { message: error.message });
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [clientId, navigate, addClient, updateClientStore, setError]);

  const handleCancel = useCallback(() => {
    reset();
    navigate('/app/clients');
  }, [navigate, reset]);

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    handleCancel,
  };
}