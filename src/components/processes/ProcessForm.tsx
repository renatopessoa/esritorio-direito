import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { HelpCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ClientSearchInput } from '../ui/ClientSearchInput';
import { processFormSchema, type Process, type ProcessFormData } from '../../types/process';
import { userService, type User } from '../../services/userService';
import { useAuthStore } from '../../stores/useAuthStore';
import { getErrorMessage } from '../../lib/axios';

interface ProcessFormProps {
  /** Processo existente para edição; ausente = novo processo. */
  process?: Process;
  onSubmit: (data: ProcessFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProcessForm({ process, onSubmit, onCancel }: ProcessFormProps) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userService
      .getUsers()
      .then((list) => setUsers(list.filter((u) => u.active)))
      .catch(() => toast.error('Não foi possível carregar a lista de responsáveis'));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProcessFormData>({
    resolver: zodResolver(processFormSchema),
    defaultValues: process
      ? {
          number: process.number,
          clientId: process.clientId,
          responsibleId: process.responsibleId,
          type: process.type,
          subject: process.subject,
          description: process.description ?? '',
          court: process.court,
          value: process.value,
          status: process.status,
          priority: process.priority,
        }
      : { status: 'ACTIVE', priority: 'MEDIUM', responsibleId: currentUserId ?? '' },
  });

  const handleFormSubmit = async (data: ProcessFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao salvar processo'));
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
                initialName={process?.client.name}
                onChange={(client) => field.onChange(client?.id ?? '')}
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
              label="Valor da Causa (R$)"
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
              {/* Montado só após carregar as opções, para o valor inicial aparecer selecionado */}
              {users.length > 0 ? (
                <select
                  className="input-dark w-full"
                  {...register('responsibleId')}
                >
                  <option value="">Selecione um responsável</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.position})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="input-dark w-full py-2 px-3 rounded-md text-gray-400">Carregando...</p>
              )}
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
