import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useClientStore } from '../../stores/useClientStore';
import type { Client } from '../../services/clientService';

interface ClientSearchInputProps {
  value?: string;
  onChange: (client: Client | null) => void;
  error?: string;
}

export function ClientSearchInput({ value, onChange, error }: ClientSearchInputProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const clients = useClientStore((state) => state.clients);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Update search when value changes externally
  useEffect(() => {
    if (value && !selectedClient) {
      const client = clients.find(c => c.id === value);
      if (client) {
        setSelectedClient(client);
        setSearch(client.name);
      }
    }
  }, [value, clients, selectedClient]);

  useEffect(() => {
    if (search.trim()) {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.documentId.includes(search)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [search, clients]);

  const handleSelectClient = (client: Client, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedClient(client);
    setSearch(client.name);
    onChange(client);
    setIsOpen(false);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Cliente
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          className="input-dark w-full pl-10"
          placeholder="Digite o nome do cliente..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            if (!e.target.value) {
              setSelectedClient(null);
              onChange(null);
            }
          }}
          onClick={handleInputClick}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}

      {isOpen && filteredClients.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-card rounded-lg shadow-lg border border-white/10 max-h-60 overflow-auto">
          {filteredClients.map((client) => (
            <button
              key={client.id}
              className="w-full text-left px-4 py-2 hover:bg-white/5 focus:bg-white/5 outline-none"
              onClick={(e) => handleSelectClient(client, e)}
              type="button"
            >
              <div className="font-medium">{client.name}</div>
              <div className="text-sm text-gray-400">
                {client.documentId} • {client.email}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}