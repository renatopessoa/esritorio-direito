import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, type ClientFormData } from '../../lib/validation/schemas';
import { Input } from '../ui/Input';
import { Button, Card } from '../ui';

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
}

export function ClientForm({ onSubmit, initialData }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email é obrigatório' })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone', { required: 'Telefone é obrigatório' })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.phone && (
              <p className="text-sm text-red-400">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              id="address"
              type="text"
              {...register('address', { required: 'Endereço é obrigatório' })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.address && (
              <p className="text-sm text-red-400">{errors.address.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
              Profissão
            </label>
            <input
              id="profession"
              type="text"
              {...register('profession', { required: 'Profissão é obrigatória' })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.profession && (
              <p className="text-sm text-red-400">{errors.profession.message}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3 mt-4">
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