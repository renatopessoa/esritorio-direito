import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProcessList } from '../components/processes/ProcessList';
import { ProcessForm } from '../components/processes/ProcessForm';
import { ProcessDetails } from '../components/processes/ProcessDetails';
import { useProcessStore } from '../stores/useProcessStore';
import { toast } from 'sonner';

export default function Processes() {
  const [view, setView] = useState<'list' | 'form' | 'details'>('list');
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    processes,
    addProcess,
    updateProcess,
    getProcessById,
  } = useProcessStore();

  const filteredProcesses = processes.filter(process => 
    process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProcess = (process: Process) => {
    setSelectedProcess(process.id);
    setView('details');
  };

  const handleUpdateDeadline = async (deadlineId: string, data: Partial<Process['deadlines'][0]>) => {
    if (!selectedProcess) return;
    
    try {
      const process = getProcessById(selectedProcess);
      if (!process) return;

      const updatedDeadlines = process.deadlines.map(deadline =>
        deadline.id === deadlineId ? { ...deadline, ...data } : deadline
      );

      await updateProcess(selectedProcess, { deadlines: updatedDeadlines });
      toast.success('Prazo atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar prazo');
    }
  };

  const handleUploadDocument = async (files: FileList) => {
    // Implementar lógica de upload
    toast.success('Documento anexado com sucesso!');
  };

  const handleDeleteDocument = async (documentId: string) => {
    // Implementar lógica de exclusão
    toast.success('Documento excluído com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Processos</h1>
        {view === 'list' && (
          <Button onClick={() => setView('form')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        )}
      </div>

      {view === 'list' && (
        <>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar processos..."
                className="input-dark w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          <ProcessList
            processes={filteredProcesses}
            onView={handleViewProcess}
          />
        </>
      )}

      {view === 'form' && (
        <ProcessForm
          onSubmit={async (data) => {
            await addProcess(data);
            setView('list');
            toast.success('Processo cadastrado com sucesso!');
          }}
        />
      )}

      {view === 'details' && selectedProcess && (
        <>
          <Button variant="outline" onClick={() => setView('list')}>
            Voltar
          </Button>

          <ProcessDetails
            process={getProcessById(selectedProcess)!}
            onUpdateDeadline={handleUpdateDeadline}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        </>
      )}
    </div>
  );
}