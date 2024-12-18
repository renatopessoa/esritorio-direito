import React from 'react';
import { DollarSign, TrendingUp, Download } from 'lucide-react';

export default function Financial() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Exportar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Receita Mensal</p>
              <p className="text-2xl font-bold mt-1">R$ 45.000</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Honorários Pendentes</p>
              <p className="text-2xl font-bold mt-1">R$ 12.500</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Custas Processuais</p>
              <p className="text-2xl font-bold mt-1">R$ 5.800</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Faturamento</h2>
          {/* Gráfico de faturamento aqui */}
        </div>
      </div>
    </div>
  );
}