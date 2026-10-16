import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import type { FinancialSummary as Summary } from '../../types/financial';
import { formatCurrency } from '../../utils/currency';

interface FinancialSummaryProps {
  summary: Summary | null;
}

export function FinancialSummary({ summary }: FinancialSummaryProps) {
  const cards = [
    {
      label: 'Saldo (recebido − pago)',
      value: summary?.balance ?? 0,
      icon: DollarSign,
      iconClass: 'bg-blue-500/20 text-blue-500',
      valueClass: (summary?.balance ?? 0) >= 0 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Receitas recebidas',
      value: summary?.income ?? 0,
      icon: TrendingUp,
      iconClass: 'bg-green-500/20 text-green-500',
      valueClass: 'text-green-400',
    },
    {
      label: 'Despesas pagas',
      value: summary?.expenses ?? 0,
      icon: TrendingDown,
      iconClass: 'bg-red-500/20 text-red-500',
      valueClass: 'text-red-400',
    },
    {
      label: 'A receber',
      value: summary?.receivable ?? 0,
      icon: Clock,
      iconClass: 'bg-yellow-500/20 text-yellow-500',
      valueClass: 'text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map(({ label, value, icon: Icon, iconClass, valueClass }) => (
        <Card key={label} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${iconClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className={`text-2xl font-bold ${valueClass}`}>
                {summary ? formatCurrency(value) : '—'}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
