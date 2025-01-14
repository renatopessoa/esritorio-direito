import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { clientSchema, type ClientFormData } from '../../lib/validation/clientSchema';
import { maskCPF, maskCNPJ, maskPhone, maskCEP } from '../../utils/masks';
import { searchAddressByCep } from '../../services/viaCep';

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ClientFormData>;
}

export function ClientForm({ onSubmit, onCancel, initialData }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      ...initialData,
      address: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        ...initialData?.address,
      },
    },
  });

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const address = await searchAddressByCep(cep);
        setValue('address.street', address.logradouro);
        setValue('address.neighborhood', address.bairro);
        setValue('address.city', address.localidade);
        setValue('address.state', address.uf);
      } catch (error) {
        toast.error('CEP não encontrado');
      }
    }
  };

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar cliente');
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
            {...register('documentId', {
              onChange: (e) => {
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = value.length <= 11 ? maskCPF(value) : maskCNPJ(value);
              },
            })}
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
            {...register('phone', {
              onChange: (e) => {
                e.target.value = maskPhone(e.target.value);
              },
            })}
          />
        </div>
      </Card>

      <Card title="Endereço">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="CEP"
            error={errors.address?.zipCode?.message}
            {...register('address.zipCode', {
              onChange: (e) => {
                e.target.value = maskCEP(e.target.value);
              },
              onBlur: handleCepBlur,
            })}
          />
          
          <div className="md:col-span-2">
            <Input
              label="Rua"
              error={errors.address?.street?.message}
              {...register('address.street')}
            />
          </div>
          
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
            maxLength={2}
            error={errors.address?.state?.message}
            {...register('address.state')}
          />
        </div>
      </Card>

      <Card title="Observações">
        <textarea
          className="input-dark w-full h-32 resize-none"
          placeholder="Observações adicionais sobre o cliente..."
          {...register('notes')}
        />
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  );
}