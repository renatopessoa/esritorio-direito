import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { HelpCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ClientSearchInput } from '../ui/ClientSearchInput';
import { processSchema, type Process } from '../../types/process';
import { useUserStore } from '../../stores/useUserStore';
import { formatCurrency } from '../../utils/currency';

interface ProcessFormProps {
  initialData?: Partial<Process>;
  onSubmit: (data: Process) => Promise<void>;
  onCancel: () => void;
}

export function ProcessForm({ initialData, onSubmit, onCancel }: ProcessFormProps) {
  const activeUsers = useUserStore((state) => state.getActiveUsers());
  
  const {
    register,
    control,
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
            placeholder="0000000-00.0000.0.00.0000"
            {...register('number')}
          />
          
          <Controller
            name="clientId"
            control={control}
            render={({ field }) => (
              <ClientSearchInput
                value={field.value}
                onChange={(client) => field.onChange(client?.id)}
                error={errors.clientId?.message}
              />
            )}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tipo
            </label>
            <select
              className="input-dark w-full"
              {...register('type')}
            >
              <option value="">Selecione o tipo</option>
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
              <option value="">Selecione o status</option>
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
              placeholder="Descreva os detalhes do processo..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-400">{errors.description.message}</p>
            )}
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
              step="0.01"
              min="0"
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
                <option value="">Selecione a prioridade</option>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
              {errors.priority && (
                <p className="text-sm text-red-400">{errors.priority.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-gray-300">
                  Responsável pelo Processo
                </label>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 rounded-lg text-xs text-gray-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Usuário que responderá pelo andamento do processo
                  </div>
                </div>
              </div>
              <select
                className="input-dark w-full"
                {...register('responsibleId')}
              >
                <option value="">Selecione um responsável</option>
                {activeUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.position})
                  </option>
                ))}
              </select>
              {errors.responsibleId && (
                <p className="text-sm text-red-400">{errors.responsibleId.message}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Processo'}
        </Button>
      </div>
    </form>
  );
}