import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, type ClientFormData } from '../../lib/validation/schemas';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
}

export function ClientForm({ onSubmit, initialData }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome Completo"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      
      <Input
        label="Telefone"
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
      
      <Input
        label="CPF/CNPJ"
        {...register('documentId')}
        error={!!errors.documentId}
        helperText={errors.documentId?.message}
      />
      
      <Input
        label="Endereço"
        {...register('address')}
        error={!!errors.address}
        helperText={errors.address?.message}
      />
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
}