import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClientList } from '../components/clients/ClientList';
import { ClientForm } from '../components/clients/ClientForm';
import { EditClientDialog } from '../components/dialogs/EditClientDialog';
import { DeleteConfirmDialog } from '../components/dialogs/DeleteConfirmDialog';
import { useClientStore } from '../stores/useClientStore';
import { createClient, updateClient, deleteClient, listClients } from '../lib/supabase/queries/clients';
import type { Client } from '../types/client';
import type { ClientFormData } from '../lib/validation/clientSchema';
import { toast } from 'sonner';

export default function Clients() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { clients, setClients, addClient, updateClientInStore, removeClient } = useClientStore();

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await listClients();
      setClients(data);
    } catch (error: any) {
      console.error('Error loading clients:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreate = async (data: ClientFormData) => {
    try {
      const newClient = await createClient(data);
      addClient(newClient);
      setIsFormOpen(false);
      toast.success('Cliente cadastrado com sucesso!');
    } catch (error: any) {
      console.error('Error creating client:', error);
      if (error.message.includes('23505')) {
        toast.error('Já existe um cliente com este CPF/CNPJ ou email');
      } else {
        toast.error(error.message || 'Erro ao cadastrar cliente');
      }
    }
  };

  const handleEdit = async (data: ClientFormData) => {
    if (!selectedClient) return;
    
    try {
      const updatedClient = await updateClient(selectedClient.id, data);
      updateClientInStore(selectedClient.id, updatedClient);
      setIsEditDialogOpen(false);
      toast.success('Cliente atualizado com sucesso!');
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error(error.message || 'Erro ao atualizar cliente');
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    
    try {
      await deleteClient(selectedClient.id);
      removeClient(selectedClient.id);
      setIsDeleteDialogOpen(false);
      toast.success('Cliente excluído com sucesso!');
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error(error.message || 'Erro ao excluir cliente');
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document_id.includes(searchTerm)
  );

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
        <ClientForm 
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
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

          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Carregando...</div>
          ) : (
            <ClientList 
              clients={filteredClients}
              onEdit={(client) => {
                setSelectedClient(client);
                setIsEditDialogOpen(true);
              }}
              onDelete={(client) => {
                setSelectedClient(client);
                setIsDeleteDialogOpen(true);
              }}
            />
          )}
        </>
      )}

      {selectedClient && (
        <>
          <EditClientDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            client={selectedClient}
            onSubmit={handleEdit}
          />

          <DeleteConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDelete}
            title="Excluir Cliente"
            description={`Tem certeza que deseja excluir o cliente "${selectedClient.name}"? Esta ação não pode ser desfeita.`}
          />
        </>
      )}
    </div>
  );
}