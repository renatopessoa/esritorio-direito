import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { clientService, type Client } from '../../services/clientService';

interface ClientSearchInputProps {
  value?: string;
  /** Nome a exibir quando o formulário já vem com um cliente (edição). */
  initialName?: string;
  onChange: (client: Client | null) => void;
  error?: string;
}

export function ClientSearchInput({ value, initialName, onChange, error }: ClientSearchInputProps) {
  const [search, setSearch] = useState(initialName ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Client[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Busca no servidor com debounce enquanto o usuário digita
  useEffect(() => {
    const term = search.trim();
    if (!isOpen || term.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await clientService.getClients({ search: term, limit: 10, sortBy: 'name', sortOrder: 'asc' });
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, isOpen]);

  const handleSelectClient = (client: Client, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSearch(client.name);
    onChange(client);
    setIsOpen(false);
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
          placeholder="Digite ao menos 2 letras do nome ou o CPF/CNPJ..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            // Texto alterado depois de escolher: o cliente selecionado deixa de valer
            if (value) onChange(null);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}

      {isOpen && search.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-card rounded-lg shadow-lg border border-white/10 max-h-60 overflow-auto">
          {isSearching && <p className="px-4 py-2 text-sm text-gray-400">Buscando...</p>}
          {!isSearching && results.length === 0 && (
            <p className="px-4 py-2 text-sm text-gray-400">Nenhum cliente encontrado</p>
          )}
          {results.map((client) => (
            <button
              key={client.id}
              className="w-full text-left px-4 py-2 hover:bg-white/5 focus:bg-white/5 outline-none"
              onMouseDown={(e) => handleSelectClient(client, e)}
              type="button"
            >
              <p className="font-medium">{client.name}</p>
              <p className="text-xs text-gray-400">{client.documentId}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
