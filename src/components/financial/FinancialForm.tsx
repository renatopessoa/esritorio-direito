import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  categoryLabels,
  financialFormSchema,
  paymentMethodLabels,
  statusLabels,
  type FinancialFormData,
} from '../../types/financial';
import { clientService, type Client } from '../../services/clientService';
import { processService } from '../../services/processService';
import type { Process } from '../../types/process';
import { getErrorMessage } from '../../lib/axios';

interface FinancialFormProps {
  initialData?: FinancialFormData;
  isEditing?: boolean;
  onSubmit: (data: FinancialFormData) => Promise<void>;
  onCancel: () => void;
}

const selectClass = 'input-dark w-full h-10 rounded-md px-3';

export function FinancialForm({ initialData, isEditing, onSubmit, onCancel }: FinancialFormProps) {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [processes, setProcesses] = useState<Process[] | null>(null);

  useEffect(() => {
    clientService
      .getClients({ limit: 100, sortBy: 'name', sortOrder: 'asc' })
      .then(({ data }) => setClients(data))
      .catch(() => setClients([]));
    processService
      .list()
      .then(setProcesses)
      .catch(() => setProcesses([]));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FinancialFormData>({
    resolver: zodResolver(financialFormSchema),
    defaultValues: initialData ?? {
      type: 'INCOME',
      category: 'FEE',
      status: 'PENDING',
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const handleFormSubmit = async (data: FinancialFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao salvar lançamento'));
    }
  };

  // Os selects de cliente/processo só montam após carregar as opções,
  // para o valor inicial (edição) aparecer selecionado
  const optionsReady = clients !== null && processes !== null;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card title={isEditing ? 'Editar Lançamento' : 'Novo Lançamento'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Tipo</label>
            <select className={selectClass} {...register('type')}>
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Categoria</label>
            <select className={selectClass} {...register('category')}>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input label="Descrição" error={errors.description?.message} {...register('description')} />
          </div>

          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium">Status</label>
            <select className={selectClass} {...register('status')}>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <Input label="Data" type="date" error={errors.date?.message} {...register('date')} />
          <Input label="Vencimento (opcional)" type="date" {...register('dueDate')} />

          {optionsReady ? (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Cliente (opcional)</label>
                <select className={selectClass} {...register('clientId')}>
                  <option value="">Nenhum</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">Processo (opcional)</label>
                <select className={selectClass} {...register('processId')}>
                  <option value="">Nenhum</option>
                  {processes.map((process) => (
                    <option key={process.id} value={process.id}>
                      {process.number} — {process.client.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <p className="md:col-span-2 text-sm text-gray-400">Carregando clientes e processos...</p>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium">Forma de pagamento</label>
            <select className={selectClass} {...register('paymentMethod')}>
              <option value="">Não informada</option>
              {Object.entries(paymentMethodLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium">Observações</label>
            <textarea className="input-dark w-full h-24 resize-none rounded-md p-3" {...register('notes')} />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !optionsReady}>
          {isSubmitting ? 'Salvando...' : 'Salvar Lançamento'}
        </Button>
      </div>
    </form>
  );
}
