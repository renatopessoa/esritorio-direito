import { useCallback, useEffect, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { addMonths, endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FinancialForm } from '../components/financial/FinancialForm';
import { FinancialSummary } from '../components/financial/FinancialSummary';
import { financialService, type FinancialPayload } from '../services/financialService';
import { useAuthStore } from '../stores/useAuthStore';
import { getErrorMessage } from '../lib/axios';
import { formatCurrency } from '../utils/currency';
import {
  categoryLabels,
  statusLabels,
  type FinancialFormData,
  type FinancialRecord,
  type FinancialSummary as Summary,
  type FinancialType,
} from '../types/financial';

type FormState = { record?: FinancialRecord } | null;

// "2026-10-16T00:00:00.000Z" -> "2026-10-16" (datas do financeiro são dias, sem horário)
const isoDay = (iso: string) => iso.slice(0, 10);
const formatDay = (iso: string) => isoDay(iso).split('-').reverse().join('/');

function toFormData(record: FinancialRecord): FinancialFormData {
  return {
    type: record.type,
    category: record.category,
    description: record.description,
    amount: record.amount,
    date: isoDay(record.date),
    dueDate: record.dueDate ? isoDay(record.dueDate) : '',
    status: record.status,
    paymentMethod: record.paymentMethod ?? undefined,
    clientId: record.clientId ?? undefined,
    processId: record.processId ?? undefined,
    notes: record.notes ?? '',
  };
}

function toPayload(data: FinancialFormData): FinancialPayload {
  return {
    ...data,
    dueDate: data.dueDate || null,
    // Vazio na edição = desvincular
    clientId: data.clientId ?? null,
    processId: data.processId ?? null,
    paymentMethod: data.paymentMethod ?? null,
  } as FinancialPayload;
}

const statusClass: Record<FinancialRecord['status'], string> = {
  PAID: 'bg-green-400/10 text-green-400',
  PENDING: 'bg-yellow-400/10 text-yellow-400',
  OVERDUE: 'bg-red-400/10 text-red-400',
  CANCELED: 'bg-gray-400/10 text-gray-400',
};

export default function Financial() {
  const role = useAuthStore((state) => state.user?.role);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [typeFilter, setTypeFilter] = useState<FinancialType | ''>('');
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<FormState>(null);

  const load = useCallback(async () => {
    const filters = {
      from: format(startOfMonth(month), 'yyyy-MM-dd'),
      to: format(endOfMonth(month), 'yyyy-MM-dd'),
    };
    setIsLoading(true);
    try {
      const [list, totals] = await Promise.all([
        financialService.list({ ...filters, type: typeFilter || undefined }),
        financialService.summary(filters),
      ]);
      setRecords(list);
      setSummary(totals);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao carregar o financeiro'));
    } finally {
      setIsLoading(false);
    }
  }, [month, typeFilter]);

  useEffect(() => {
    if (role !== 'ASSISTANT') load();
  }, [load, role]);

  if (role === 'ASSISTANT') {
    return (
      <Card className="p-8 text-center text-gray-400">
        O módulo financeiro é restrito a advogados e administradores.
      </Card>
    );
  }

  const handleSubmit = async (data: FinancialFormData) => {
    if (form?.record) {
      await financialService.update(form.record.id, toPayload(data));
    } else {
      await financialService.create(toPayload(data));
    }
    toast.success('Lançamento salvo');
    setForm(null);
    load();
  };

  const markPaid = async (record: FinancialRecord) => {
    try {
      await financialService.update(record.id, { status: 'PAID' });
      toast.success('Lançamento marcado como pago');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao atualizar lançamento'));
    }
  };

  const remove = async (record: FinancialRecord) => {
    if (!window.confirm(`Excluir o lançamento "${record.description}"?`)) return;
    try {
      await financialService.remove(record.id);
      toast.success('Lançamento excluído');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir lançamento'));
    }
  };

  if (form) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <FinancialForm
          key={form.record?.id ?? 'new'}
          initialData={form.record ? toFormData(form.record) : undefined}
          isEditing={!!form.record}
          onSubmit={handleSubmit}
          onCancel={() => setForm(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Financeiro</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setMonth((m) => subMonths(m, 1))} aria-label="Mês anterior">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="min-w-[140px] text-center capitalize font-medium">
              {format(month, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Próximo mês">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button onClick={() => setForm({})}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lançamento
        </Button>
      </div>

      <FinancialSummary summary={summary} />

      <Card>
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10">
          <h3 className="text-lg font-semibold">Lançamentos do mês</h3>
          <select
            className="input-dark h-9 rounded-md px-3 text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FinancialType | '')}
            aria-label="Filtrar por tipo"
          >
            <option value="">Receitas e despesas</option>
            <option value="INCOME">Só receitas</option>
            <option value="EXPENSE">Só despesas</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Descrição</th>
                <th className="text-left py-3 px-4">Categoria</th>
                <th className="text-left py-3 px-4">Cliente / Processo</th>
                <th className="text-right py-3 px-4">Valor</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="py-3 px-4 whitespace-nowrap">{formatDay(record.date)}</td>
                  <td className="py-3 px-4">{record.description}</td>
                  <td className="py-3 px-4">{categoryLabels[record.category]}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {[record.client?.name, record.process?.number].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td
                    className={`py-3 px-4 text-right whitespace-nowrap font-medium ${
                      record.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {record.type === 'INCOME' ? '+ ' : '− '}
                    {formatCurrency(record.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass[record.status]}`}>
                      {statusLabels[record.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-1">
                      {(record.status === 'PENDING' || record.status === 'OVERDUE') && (
                        <Button variant="ghost" size="sm" onClick={() => markPaid(record)} aria-label="Marcar como pago">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setForm({ record })} aria-label="Editar">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {role === 'ADMIN' && (
                        <Button variant="ghost" size="sm" onClick={() => remove(record)} aria-label="Excluir">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {records.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    {isLoading ? 'Carregando...' : 'Nenhum lançamento neste mês'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
