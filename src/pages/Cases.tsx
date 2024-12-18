import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';

export default function Cases() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Casos</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Novo Caso
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative flex-1 mr-4">
            <input
              type="text"
              placeholder="Buscar casos..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </button>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Número</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Próximo Prazo</th>
                <th className="pb-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Lista de casos aqui */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}