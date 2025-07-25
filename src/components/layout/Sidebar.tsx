import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Calendar, Settings, BarChart, LogOut, UserPlus, Calculator, NotebookText } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from 'sonner';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Users, label: 'Clientes', path: '/app/clients' },
  { icon: Briefcase, label: 'Processos', path: '/app/processes' },
  { icon: Calendar, label: 'Agenda', path: '/app/calendar' },
  { icon: BarChart, label: 'Financeiro', path: '/app/financial' },
  { icon: UserPlus, label: 'Cadastro de Usuário', path: '/app/user-registration' },
  { icon: Settings, label: 'Configurações', path: '/app/settings' },
  { icon: Calculator, label: 'Cálculo INSS', path: '/app/INSSCalculator' },
  { icon: NotebookText, label: 'Cálculo Aposentadoria', path: '/app/AposentadoriaCalculator' },
] as const;

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="w-64 glass-card border-r border-white/10">
      <nav className="px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center px-3 py-2 rounded-lg mb-1 transition-all duration-200',
                {
                  'bg-primary/20 text-primary': isActive,
                  'text-muted-foreground hover:bg-white/5': !isActive,
                }
              )}
            >
              {item.icon && <item.icon className="w-5 h-5 mr-3" />}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-muted-foreground hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  );
}