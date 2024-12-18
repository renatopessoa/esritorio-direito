import React from 'react';
import { Card } from '../ui/Card';
import { ProcessDeadlines } from './ProcessDeadlines';
import { ProcessDocuments } from './ProcessDocuments';
import type { Process } from '../../types/process';
import { formatDateTime } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface ProcessDetailsProps {
  process: Process;
  onUpdateDeadline: (id: string, data: Partial<Process['deadlines'][0]>) => Promise<void>;
  onUploadDocument: (files: FileList) => Promise<void>;
  onDeleteDocument: (documentId: string) => Promise<void>;
}

export function ProcessDetails({
  process,
  onUpdateDeadline,
  onUploadDocument,
  onDeleteDocument,
}: ProcessDetailsProps) {
  return (
    <div className="space-y-6">
      <Card title="Informações do Processo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Número do Processo</h4>
            <p className="text-lg text-white">{process.number}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Tipo</h4>
            <p className="text-lg text-white">{process.type}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Vara</h4>
            <p className="text-lg text-white">{process.court.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Comarca</h4>
            <p className="text-lg text-white">{process.court.district}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Valor da Causa</h4>
            <p className="text-lg text-white">{formatCurrency(process.value)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Data de Cadastro</h4>
            <p className="text-lg text-white">{formatDateTime(process.createdAt!)}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Descrição</h4>
          <p className="text-white">{process.description}</p>
        </div>
      </Card>

      <ProcessDeadlines
        process={process}
        onUpdateDeadline={onUpdateDeadline}
      />

      <ProcessDocuments
        process={process}
        onUpload={onUploadDocument}
        onDelete={onDeleteDocument}
      />
    </div>
  );
}