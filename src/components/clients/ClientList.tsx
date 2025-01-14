import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Client } from '../../types/client';
import { formatDate } from '../../utils/date';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
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
                <td className="py-3 px-4">{client.document_id}</td>
                <td className="py-3 px-4">{client.email}</td>
                <td className="py-3 px-4">{client.phone}</td>
                <td className="py-3 px-4">{formatDate(client.created_at)}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(client)}
                      className="hover:text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(client)}
                      className="hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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