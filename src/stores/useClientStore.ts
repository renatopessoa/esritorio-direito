import { create } from 'zustand';
import type { Client } from '../types/client';

interface ClientStore {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClientInStore: (id: string, data: Client) => void;
  removeClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  setClients: (clients) => set({ clients }),
  addClient: (client) => set((state) => ({ 
    clients: [...state.clients, client] 
  })),
  updateClientInStore: (id, data) => set((state) => ({
    clients: state.clients.map((client) =>
      client.id === id ? { ...client, ...data } : client
    ),
  })),
  removeClient: (id) => set((state) => ({
    clients: state.clients.filter((client) => client.id !== id),
  })),
  getClientById: (id) => get().clients.find((client) => client.id === id),
}));