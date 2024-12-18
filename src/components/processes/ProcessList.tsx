import React from 'react';
import { FileText, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Process } from '../../types/process';
import { formatDate } from '../../utils/date';

interface ProcessListProps {
  processes: Process[];
  onView: (process: Process) => void;
}

export function ProcessList({ processes, onView }: ProcessListProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th className="text-left py-3 px-4">Número</th>
              <th className="text-left py-3 px-4">Cliente</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Próximo Prazo</th>
              <th className="text-left py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {processes.map((process) => (
              <tr key={process.id}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    {process.number}
                  </div>
                </td>
                <td className="py-3 px-4">{process.subject}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    process.status === 'ACTIVE' 
                      ? 'bg-green-400/10 text-green-400'
                      : process.status === 'SUSPENDED'
                      ? 'bg-yellow-400/10 text-yellow-400'
                      : 'bg-gray-400/10 text-gray-400'
                  }`}>
                    {process.status === 'ACTIVE' ? 'Ativo' 
                      : process.status === 'SUSPENDED' ? 'Suspenso' 
                      : 'Arquivado'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {process.deadlines?.[0] ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      {formatDate(process.deadlines[0].date)}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      Sem prazos
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onView(process)}
                  >
                    Detalhes
                  </Button>
                </td>
              </tr>
            ))}

            {processes.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  Nenhum processo encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}