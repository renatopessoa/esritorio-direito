import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  deadlineFormSchema,
  deadlineTypeLabels,
  type DeadlineFormData,
  type Process,
  type ProcessDeadline,
} from '../../types/process';
import { useProcessStore } from '../../stores/useProcessStore';
import { getErrorMessage } from '../../lib/axios';
import { formatDateTime } from '../../utils/date';

interface ProcessDeadlinesProps {
  process: Process;
}

export function ProcessDeadlines({ process }: ProcessDeadlinesProps) {
  const { addDeadline, updateDeadline, removeDeadline } = useProcessStore();
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeadlineFormData>({
    resolver: zodResolver(deadlineFormSchema),
    defaultValues: { type: 'PETITION' },
  });

  const onAdd = async (data: DeadlineFormData) => {
    try {
      await addDeadline(process.id, { ...data, date: new Date(data.date).toISOString() });
      toast.success('Prazo cadastrado');
      reset({ type: 'PETITION' });
      setIsAdding(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao cadastrar prazo'));
    }
  };

  const toggleStatus = async (deadline: ProcessDeadline) => {
    try {
      await updateDeadline(process.id, deadline.id, {
        status: deadline.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
      });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao atualizar prazo'));
    }
  };

  const onRemove = async (deadline: ProcessDeadline) => {
    if (!window.confirm(`Excluir o prazo "${deadline.title}"?`)) return;
    try {
      await removeDeadline(process.id, deadline.id);
      toast.success('Prazo excluído');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir prazo'));
    }
  };

  return (
    <Card title="Prazos e Audiências">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Prazos</h3>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Prazo
            </Button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit(onAdd)} className="glass-card rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Título" error={errors.title?.message} {...register('title')} />
              <Input label="Data e hora" type="datetime-local" error={errors.date?.message} {...register('date')} />
              <div className="space-y-1">
                <label className="block text-sm font-medium">Tipo</label>
                <select className="input-dark w-full h-10 rounded-md px-3" {...register('type')}>
                  {Object.entries(deadlineTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input label="Observação (opcional)" {...register('description')} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Prazo'}</Button>
            </div>
          </form>
        )}

        <div className="divide-y divide-white/10">
          {process.deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">
                    {deadline.title}{' '}
                    <span className="text-xs text-gray-400">({deadlineTypeLabels[deadline.type]})</span>
                  </h4>
                  <p className="text-sm text-gray-400">
                    {formatDateTime(deadline.date)}
                  </p>
                  {deadline.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {deadline.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deadline.status === 'PENDING'
                      ? 'bg-yellow-400/10 text-yellow-400'
                      : deadline.status === 'COMPLETED'
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-red-400/10 text-red-400'
                  }`}
                >
                  {deadline.status === 'PENDING'
                    ? 'Pendente'
                    : deadline.status === 'COMPLETED'
                    ? 'Concluído'
                    : 'Cancelado'}
                </span>
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(deadline)}>
                  {deadline.status === 'PENDING' ? 'Concluir' : 'Reabrir'}
                </Button>
                <Button variant="ghost" size="sm" aria-label="Excluir prazo" onClick={() => onRemove(deadline)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))}

          {process.deadlines.length === 0 && (
            <p className="text-center py-8 text-gray-400">
              Nenhum prazo cadastrado
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
