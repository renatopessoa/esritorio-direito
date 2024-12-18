import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { financialRecordSchema, type FinancialRecord } from '../../types/financial';
import { useProcessStore } from '../../stores/useProcessStore';
import { useClientStore } from '../../stores/useClientStore';

interface FinancialFormProps {
  initialData?: Partial<FinancialRecord>;
  onSubmit: (data: FinancialRecord) => Promise<void>;
}

export function FinancialForm({ initialData, onSubmit }: FinancialFormProps) {
  const processes = useProcessStore((state) => state.processes);
  const clients = useClientStore((state) => state.clients);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FinancialRecord>({
    resolver: zodResolver(financialRecordSchema),
    defaultValues: {
      ...initialData,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const type = watch('type');

  const handleFormSubmit = async (data: FinancialRecord) => {
    try {
      await onSubmit(data);
      toast.success('Registro financeiro salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar registro financeiro');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card title="Dados do Lançamento">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tipo
            </label>
            <select
              className="input-dark w-full"
              {...register('type')}
            >
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-400">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Categoria
            </label>
            <select
              className="input-dark w-full"
              {...register('category')}
            >
              <option value="FEE">Honorários</option>
              <option value="COURT_COST">Custas Processuais</option>
              <option value="TRAVEL">Despesas de Viagem</option>
              <option value="OTHER">Outros</option>
            </select>
          </div>

          <Input
            label="Valor"
            type="number"
            step="0.01"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />

          <Input
            label="Data"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />

          {type === 'INCOME' && (
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
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Processo
            </label>
            <select
              className="input-dark w-full"
              {...register('processId')}
            >
              <option value="">Selecione um processo</option>
              {processes.map((process) => (
                <option key={process.id} value={process.id}>
                  {process.number}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card title="Detalhes">
        <div className="space-y-4">
          <Input
            label="Descrição"
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                className="input-dark w-full"
                {...register('status')}
              >
                <option value="PAID">Pago</option>
                <option value="PENDING">Pendente</option>
                <option value="OVERDUE">Vencido</option>
                <option value="CANCELED">Cancelado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Forma de Pagamento
              </label>
              <select
                className="input-dark w-full"
                {...register('paymentMethod')}
              >
                <option value="CASH">Dinheiro</option>
                <option value="CREDIT_CARD">Cartão de Crédito</option>
                <option value="BANK_TRANSFER">Transferência Bancária</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Observações
            </label>
            <textarea
              className="input-dark w-full h-24 resize-none"
              {...register('notes')}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
        </Button>
      </div>
    </form>
  );
}