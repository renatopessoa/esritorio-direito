import { Card } from '../ui/Card';
import { ProcessDeadlines } from './ProcessDeadlines';
import { priorityLabels, processTypeLabels, type Process } from '../../types/process';
import { formatDateTime } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface ProcessDetailsProps {
  process: Process;
}

export function ProcessDetails({ process }: ProcessDetailsProps) {
  const fields: Array<[string, string]> = [
    ['Número do Processo', process.number],
    ['Cliente', process.client.name],
    ['Tipo', processTypeLabels[process.type]],
    ['Prioridade', priorityLabels[process.priority]],
    ['Vara', process.court.name],
    ['Comarca', process.court.district],
    ['Valor da Causa', formatCurrency(process.value)],
    ['Responsável', process.responsible.name],
    ['Data de Cadastro', formatDateTime(process.createdAt)],
    ['Última Atualização', formatDateTime(process.updatedAt)],
  ];

  return (
    <div className="space-y-6">
      <Card title={process.subject}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(([label, value]) => (
            <div key={label}>
              <h4 className="text-sm font-medium text-gray-400 mb-1">{label}</h4>
              <p className="text-lg text-white">{value}</p>
            </div>
          ))}
        </div>

        {process.description && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Descrição</h4>
            <p className="text-white whitespace-pre-line">{process.description}</p>
          </div>
        )}
      </Card>

      <ProcessDeadlines process={process} />
    </div>
  );
}
