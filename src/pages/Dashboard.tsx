import React from 'react';
import { Card } from '../components/ui/Card';
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
}

function DashboardCard({ icon, title, value, color }: DashboardCardProps) {
  return (
    <Card>
      <div className={`${color} text-white p-3 rounded-full w-fit mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1 text-white">{value}</p>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          icon={<Briefcase className="w-8 h-8" />}
          title="Processos Ativos"
          value="24"
          color="bg-blue-500"
        />
        <DashboardCard
          icon={<Clock className="w-8 h-8" />}
          title="Prazos Próximos"
          value="8"
          color="bg-yellow-500"
        />
        <DashboardCard
          icon={<AlertCircle className="w-8 h-8" />}
          title="Audiências Hoje"
          value="3"
          color="bg-red-500"
        />
        <DashboardCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Faturamento Mensal"
          value="R$ 45.000"
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Próximos Compromissos">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
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
            <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
              <Clock className="w-10 h-10 text-yellow-400" />
              <div>
                <h4 className="font-medium text-white">Recurso - Processo 5678</h4>
                <p className="text-gray-400">Vence em 3 dias</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}