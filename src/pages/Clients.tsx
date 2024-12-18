import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClientList } from '../components/clients/ClientList';
import { ClientForm } from '../components/clients/ClientForm';
import { useClientStore } from '../stores/useClientStore';

export default function Clients() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const clients = useClientStore((state) => state.clients);
  const addClient = useClientStore((state) => state.addClient);

  const handleSubmit = async (data: Client) => {
    await addClient({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Clientes</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {isFormOpen ? (
        <ClientForm onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
      ) : (
        <>
          <Card>
            <div className="p-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  className="input-dark w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <ClientList 
            clients={clients.filter(client => 
              client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              client.documentId.includes(searchTerm)
            )} 
          />
        </>
      )}
    </div>
  );
}