import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { clientSchema, type Client } from '../../types/client';
import { maskCPF, maskCNPJ, maskPhone, maskCEP } from '../../utils/masks';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: Client) => Promise<void>;
}

export function ClientForm({ initialData, onSubmit }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Client>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });

  const documentId = watch('documentId');

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('documentId', value.length <= 11 ? maskCPF(value) : maskCNPJ(value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', maskPhone(e.target.value));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('address.zipCode', maskCEP(e.target.value));
  };

  const handleFormSubmit = async (data: Client) => {
    try {
      await onSubmit(data);
      toast.success('Cliente salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card title="Dados Pessoais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome Completo"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="CPF/CNPJ"
            error={errors.documentId?.message}
            value={documentId}
            onChange={handleDocumentChange}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Telefone"
            error={errors.phone?.message}
            {...register('phone')}
            onChange={handlePhoneChange}
          />
        </div>
      </Card>

      <Card title="Endereço">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="CEP"
            error={errors.address?.zipCode?.message}
            {...register('address.zipCode')}
            onChange={handleCEPChange}
          />
          <Input
            label="Rua"
            error={errors.address?.street?.message}
            {...register('address.street')}
          />
          <Input
            label="Número"
            error={errors.address?.number?.message}
            {...register('address.number')}
          />
          <Input
            label="Complemento"
            {...register('address.complement')}
          />
          <Input
            label="Bairro"
            error={errors.address?.neighborhood?.message}
            {...register('address.neighborhood')}
          />
          <Input
            label="Cidade"
            error={errors.address?.city?.message}
            {...register('address.city')}
          />
          <Input
            label="Estado"
            error={errors.address?.state?.message}
            maxLength={2}
            {...register('address.state')}
          />
        </div>
      </Card>

      <Card title="Observações">
        <textarea
          className="input-dark w-full h-32 resize-none"
          placeholder="Observações sobre o cliente..."
          {...register('notes')}
        />
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  );
}