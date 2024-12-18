import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Client } from '../../types/client';

interface ClientHistoryProps {
  client: Client;
  onAddEntry: (entry: Client['history'][0]) => Promise<void>;
}

export function ClientHistory({ client, onAddEntry }: ClientHistoryProps) {
  return (
    <Card title="Histórico de Atendimentos">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Histórico</h3>
          <Button onClick={() => {/* Abrir modal de novo registro */}}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        </div>

        <div className="divide-y divide-white/10">
          {client.history?.map((entry) => (
            <div key={entry.id} className="py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {new Date(entry.date).toLocaleString()}
                </span>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-400/10 text-blue-400">
                  {entry.type}
                </span>
              </div>
              <p className="mt-2">{entry.description}</p>
            </div>
          ))}

          {!client.history?.length && (
            <p className="text-gray-400 text-center py-4">
              Nenhum registro no histórico
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}