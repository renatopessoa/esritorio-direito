import React from 'react';
import { Scale, Shield, Clock, BarChart } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { useNavigate } from 'react-router-dom';

export function FeaturesGrid() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <FeatureCard
          icon={<Shield className="w-8 h-8 text-blue-400" />}
          title="Segurança Total"
          description="Proteção de dados e conformidade com LGPD"
        />
        <FeatureCard
          icon={<Clock className="w-8 h-8 text-purple-400" />}
          title="Gestão de Prazos"
          description="Controle eficiente de compromissos e audiências"
        />
        <FeatureCard
          icon={<BarChart className="w-8 h-8 text-blue-400" />}
          title="Análise Financeira"
          description="Gestão completa de honorários e despesas"
        />
        <FeatureCard
          icon={<Scale className="w-8 h-8 text-purple-400" />}
          title="Processos Digitais"
          description="Acompanhamento processual integrado"
        />
      </div>
      
      <div className="text-center">
        <button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
        >
          Acessar Sistema
        </button>
      </div>
    </div>
  );
}