import { create } from 'zustand';
import type { Client } from '../types/client';

interface ClientStore {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  addClient: (client) => 
    set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (id, data) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...data } : client
      ),
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
  getClientById: (id) => get().clients.find((client) => client.id === id),
}));