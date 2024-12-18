import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Process } from '../../types/process';
import { formatDate } from '../../utils/date';

interface ProcessDeadlinesProps {
  process: Process;
  onUpdateDeadline: (id: string, data: Partial<Process['deadlines'][0]>) => Promise<void>;
}

export function ProcessDeadlines({ process, onUpdateDeadline }: ProcessDeadlinesProps) {
  return (
    <Card title="Prazos e Audiências">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Próximos Prazos</h3>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Prazo
          </Button>
        </div>

        <div className="divide-y divide-white/10">
          {process.deadlines?.map((deadline) => (
            <div
              key={deadline.id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">{deadline.title}</h4>
                  <p className="text-sm text-gray-400">
                    {formatDate(deadline.date)}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onUpdateDeadline(deadline.id, {
                      status:
                        deadline.status === 'PENDING'
                          ? 'COMPLETED'
                          : 'PENDING',
                    })
                  }
                >
                  {deadline.status === 'PENDING' ? 'Concluir' : 'Reabrir'}
                </Button>
              </div>
            </div>
          ))}

          {!process.deadlines?.length && (
            <p className="text-center py-8 text-gray-400">
              Nenhum prazo cadastrado
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}