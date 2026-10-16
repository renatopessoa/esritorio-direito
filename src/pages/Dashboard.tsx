import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInCalendarDays, format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { LegalNews } from '../components/dashboard/LegalNews';
import {
  Briefcase,
  Clock,
  Calendar as CalendarIcon,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { dashboardService, type DashboardData } from '../services/dashboardService';
import { getErrorMessage } from '../lib/axios';
import { formatCurrency } from '../utils/currency';
import { deadlineTypeLabels } from '../types/process';
import { categoryLabels } from '../types/calendar';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  onClick?: () => void;
}

function DashboardCard({ icon, title, value, color, onClick }: DashboardCardProps) {
  return (
    <Card
      className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${onClick ? 'hover:ring-2 ring-primary/20' : ''}`}
      onClick={onClick}
    >
      <div className={`${color} text-white p-3 rounded-full w-fit mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1 text-white">{value}</p>
    </Card>
  );
}

function whenLabel(iso: string) {
  const date = new Date(iso);
  const time = format(date, 'HH:mm');
  if (isToday(date)) return `Hoje às ${time}`;
  if (isTomorrow(date)) return `Amanhã às ${time}`;
  const days = differenceInCalendarDays(date, new Date());
  return `${format(date, "dd/MM 'às' HH:mm", { locale: ptBR })} · em ${days} dias`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    dashboardService
      .get()
      .then(setData)
      .catch((error) => toast.error(getErrorMessage(error, 'Erro ao carregar o painel')));
  }, []);

  const count = (value?: number) => (data ? String(value ?? 0) : '…');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">JurSys</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon={<Briefcase className="w-8 h-8" />}
          title="Processos Ativos"
          value={count(data?.activeProcesses)}
          color="bg-blue-500"
          onClick={() => navigate('/app/processes')}
        />
        <DashboardCard
          icon={<Clock className="w-8 h-8" />}
          title="Prazos nos próximos 7 dias"
          value={count(data?.weekDeadlines)}
          color="bg-yellow-500"
          onClick={() => navigate('/app/processes')}
        />
        <DashboardCard
          icon={<AlertCircle className="w-8 h-8" />}
          title="Audiências Hoje"
          value={count(data?.hearingsToday)}
          color="bg-red-500"
          onClick={() => navigate('/app/calendar')}
        />
        {/* Faturamento só aparece para quem tem acesso ao financeiro */}
        {data?.monthlyIncome !== null && (
          <DashboardCard
            icon={<DollarSign className="w-8 h-8" />}
            title="Recebido no mês"
            value={data ? formatCurrency(data.monthlyIncome ?? 0) : '…'}
            color="bg-green-500"
            onClick={() => navigate('/app/financial')}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Próximos Compromissos">
          <div className="space-y-4">
            {data?.upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-4 glass-card rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => navigate('/app/calendar')}
              >
                <CalendarIcon className="w-10 h-10 text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-medium text-white">{event.title}</h4>
                  <p className="text-gray-400">
                    {whenLabel(event.start)} · {categoryLabels[event.category]}
                    {event.location ? ` · ${event.location}` : ''}
                  </p>
                </div>
              </div>
            ))}
            {data && data.upcomingEvents.length === 0 && (
              <p className="text-center py-4 text-gray-400">Nenhum compromisso agendado</p>
            )}
          </div>
        </Card>

        <Card title="Prazos Importantes">
          <div className="space-y-4">
            {data?.upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-center gap-4 p-4 glass-card rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => navigate('/app/processes')}
              >
                <Clock className="w-10 h-10 text-yellow-400 shrink-0" />
                <div>
                  <h4 className="font-medium text-white">
                    {deadlineTypeLabels[deadline.type]}: {deadline.title}
                  </h4>
                  <p className="text-gray-400">
                    {whenLabel(deadline.date)} · Processo {deadline.process.number} ({deadline.process.client.name})
                  </p>
                </div>
              </div>
            ))}
            {data && data.upcomingDeadlines.length === 0 && (
              <p className="text-center py-4 text-gray-400">Nenhum prazo pendente</p>
            )}
          </div>
        </Card>
      </div>

      <LegalNews />
    </div>
  );
}
