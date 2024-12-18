import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { Client } from '../../types/client';
import { formatDate } from '../../utils/date';

interface ClientListProps {
  clients: Client[];
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export function ClientList({ clients, onView, onEdit, onDelete }: ClientListProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th className="text-left py-3 px-4">Nome</th>
              <th className="text-left py-3 px-4">CPF/CNPJ</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Telefone</th>
              <th className="text-left py-3 px-4">Cadastro</th>
              <th className="text-left py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="py-3 px-4">{client.name}</td>
                <td className="py-3 px-4">{client.documentId}</td>
                <td className="py-3 px-4">{client.email}</td>
                <td className="py-3 px-4">{client.phone}</td>
                <td className="py-3 px-4">{formatDate(client.createdAt!)}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {onView && (
                      <Button variant="ghost" size="sm" onClick={() => onView(client)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(client)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(client)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {clients.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}