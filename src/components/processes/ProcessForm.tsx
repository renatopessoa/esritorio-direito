import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { processSchema, type Process } from '../../types/process';
import { useClientStore } from '../../stores/useClientStore';

interface ProcessFormProps {
  initialData?: Partial<Process>;
  onSubmit: (data: Process) => Promise<void>;
}

export function ProcessForm({ initialData, onSubmit }: ProcessFormProps) {
  const clients = useClientStore((state) => state.clients);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Process>({
    resolver: zodResolver(processSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: Process) => {
    try {
      await onSubmit(data);
      toast.success('Processo salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar processo');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card title="Dados do Processo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Número do Processo"
            error={errors.number?.message}
            {...register('number')}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Cliente
            </label>
            <select
              className="input-dark w-full"
              {...register('clientId')}
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-sm text-red-400">{errors.clientId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tipo
            </label>
            <select
              className="input-dark w-full"
              {...register('type')}
            >
              <option value="CIVIL">Civil</option>
              <option value="CRIMINAL">Criminal</option>
              <option value="LABOR">Trabalhista</option>
              <option value="TAX">Tributário</option>
              <option value="OTHER">Outro</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-400">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <select
              className="input-dark w-full"
              {...register('status')}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="ARCHIVED">Arquivado</option>
              <option value="SUSPENDED">Suspenso</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-400">{errors.status.message}</p>
            )}
          </div>
        </div>
      </Card>

      <Card title="Detalhes">
        <div className="space-y-4">
          <Input
            label="Assunto"
            error={errors.subject?.message}
            {...register('subject')}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Descrição
            </label>
            <textarea
              className="input-dark w-full h-32 resize-none"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Vara"
              error={errors.court?.name?.message}
              {...register('court.name')}
            />
            <Input
              label="Comarca"
              error={errors.court?.district?.message}
              {...register('court.district')}
            />
            <Input
              label="Valor da Causa"
              type="number"
              error={errors.value?.message}
              {...register('value', { valueAsNumber: true })}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Prioridade
              </label>
              <select
                className="input-dark w-full"
                {...register('priority')}
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Processo'}
        </Button>
      </div>
    </form>
  );
}