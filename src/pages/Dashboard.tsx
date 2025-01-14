import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { LegalNews } from '../components/dashboard/LegalNews';
import { 
  Briefcase, 
  Clock, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  DollarSign 
} from 'lucide-react';

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
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${onClick ? 'hover:ring-2 ring-primary/20' : ''}`}
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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">JurSys</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon={<Briefcase className="w-8 h-8" />}
          title="Processos Ativos"
          value=""
          color="bg-blue-500"
          onClick={() => navigate('/app/processes')}
        />
        <DashboardCard
          icon={<Clock className="w-8 h-8" />}
          title="Prazos Próximos"
          value=""
          color="bg-yellow-500"
          onClick={() => navigate('/app/calendar')}
        />
        <DashboardCard
          icon={<AlertCircle className="w-8 h-8" />}
          title="Audiências Hoje"
          value=""
          color="bg-red-500"
          onClick={() => navigate('/app/calendar')}
        />
        <DashboardCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Faturamento Mensal"
          value="R$"
          color="bg-green-500"
          onClick={() => navigate('/app/financial')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Próximos Compromissos">
          <div className="space-y-4">
            <div 
              className="flex items-center gap-4 p-4 glass-card rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => navigate('/app/calendar')}
            >
              <CalendarIcon className="w-10 h-10 text-blue-400" />
              <div>
                <h4 className="font-medium text-white">Audiência - Processo 1234</h4>
                <p className="text-gray-400">Hoje às 14:00 - Vara Civil</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card title="Prazos Importantes">
          <div className="space-y-4">
            <div 
              className="flex items-center gap-4 p-4 glass-card rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => navigate('/app/processes')}
            >
              <Clock className="w-10 h-10 text-yellow-400" />
              <div>
                <h4 className="font-medium text-white">Recurso - Processo 5678</h4>
                <p className="text-gray-400">Vence em 3 dias</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <LegalNews />
    </div>
  );
}