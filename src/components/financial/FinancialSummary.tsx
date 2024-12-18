import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { useFinancialStore } from '../../stores/useFinancialStore';
import { formatCurrency } from '../../utils/currency';

export function FinancialSummary() {
  const { getBalance, getIncomeTotal, getExpenseTotal } = useFinancialStore();

  const balance = getBalance();
  const income = getIncomeTotal();
  const expenses = getExpenseTotal();

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Saldo Total</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Receitas</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(income)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-red-500/20 p-3 rounded-full">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Despesas</p>
              <p className="text-2xl font-bold text-red-400">
                {formatCurrency(expenses)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alertas Financeiros */}
      <Card title="Alertas Financeiros">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
            <AlertCircle className="w-10 h-10 text-yellow-400" />
            <div>
              <h4 className="font-medium text-white">Honorários Pendentes</h4>
              <p className="text-gray-400">3 pagamentos atrasados totalizando R$ 12.500,00</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <div>
              <h4 className="font-medium text-white">Custas Processuais</h4>
              <p className="text-gray-400">5 custas a vencer nos próximos 7 dias</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Últimas Movimentações */}
      <Card title="Últimas Movimentações">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-card rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-2 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-white">Honorários - Processo #1234</h4>
                <p className="text-sm text-gray-400">Recebido em 15/03/2024</p>
              </div>
            </div>
            <p className="text-lg font-medium text-green-400">+ R$ 5.000,00</p>
          </div>

          <div className="flex items-center justify-between p-4 glass-card rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-red-500/20 p-2 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium text-white">Custas - Processo #5678</h4>
                <p className="text-sm text-gray-400">Pago em 14/03/2024</p>
              </div>
            </div>
            <p className="text-lg font-medium text-red-400">- R$ 1.200,00</p>
          </div>
        </div>
      </Card>
    </div>
  );
}