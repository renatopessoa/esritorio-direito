import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { ProcessList } from '../components/processes/ProcessList';
import { ProcessForm } from '../components/processes/ProcessForm';
import { ProcessDetails } from '../components/processes/ProcessDetails';
import { useProcessStore } from '../stores/useProcessStore';
import { useAuthStore } from '../stores/useAuthStore';
import { getErrorMessage } from '../lib/axios';
import type { ProcessStatus } from '../types/process';

type View = { name: 'list' } | { name: 'create' } | { name: 'details'; id: string } | { name: 'edit'; id: string };

export default function Processes() {
  const [view, setView] = useState<View>({ name: 'list' });
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<ProcessStatus | ''>('ACTIVE');

  const { processes, isLoading, fetchProcesses, createProcess, updateProcess, deleteProcess, getProcessById } =
    useProcessStore();
  const canDelete = useAuthStore((state) => state.user?.role !== 'ASSISTANT');

  // Busca no servidor com debounce ao mudar filtro ou termo
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProcesses({ search: searchTerm.trim() || undefined, status: status || undefined }).catch((error) =>
        toast.error(getErrorMessage(error, 'Erro ao carregar processos'))
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, status, fetchProcesses]);

  const selected = view.name === 'details' || view.name === 'edit' ? getProcessById(view.id) : undefined;

  const handleDelete = async (id: string) => {
    const process = getProcessById(id);
    if (!process || !window.confirm(`Excluir o processo ${process.number}? Os prazos serão excluídos junto.`)) return;
    try {
      await deleteProcess(id);
      toast.success('Processo excluído');
      setView({ name: 'list' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir processo'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Processos</h1>
        {view.name === 'list' && (
          <Button onClick={() => setView({ name: 'create' })}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        )}
      </div>

      {view.name === 'list' && (
        <>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número, assunto ou cliente..."
                className="input-dark w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input-dark rounded-md px-3"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProcessStatus | '')}
              aria-label="Filtrar por status"
            >
              <option value="ACTIVE">Ativos</option>
              <option value="SUSPENDED">Suspensos</option>
              <option value="ARCHIVED">Arquivados</option>
              <option value="">Todos</option>
            </select>
          </div>

          <ProcessList
            processes={processes}
            isLoading={isLoading}
            onView={(process) => setView({ name: 'details', id: process.id })}
          />
        </>
      )}

      {view.name === 'create' && (
        <ProcessForm
          onCancel={() => setView({ name: 'list' })}
          onSubmit={async (data) => {
            const process = await createProcess(data);
            toast.success('Processo cadastrado com sucesso!');
            setView({ name: 'details', id: process.id });
          }}
        />
      )}

      {view.name === 'edit' && selected && (
        <ProcessForm
          process={selected}
          onCancel={() => setView({ name: 'details', id: selected.id })}
          onSubmit={async (data) => {
            await updateProcess(selected.id, data);
            toast.success('Processo atualizado');
            setView({ name: 'details', id: selected.id });
          }}
        />
      )}

      {view.name === 'details' && selected && (
        <>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setView({ name: 'list' })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setView({ name: 'edit', id: selected.id })}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
              {canDelete && (
                <Button variant="destructive" onClick={() => handleDelete(selected.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              )}
            </div>
          </div>

          <ProcessDetails process={selected} />
        </>
      )}
    </div>
  );
}
