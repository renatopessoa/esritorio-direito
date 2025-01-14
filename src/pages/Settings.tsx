import React from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { useAuthStore } from '../stores/useAuthStore';

export default function Settings() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Perfil">
          <form className="space-y-4">
            <Input
              label="Nome"
              defaultValue={user?.name}
            />
            <Input
              label="Email"
              type="email"
              defaultValue={user?.email}
            />
            <Button>Salvar Alterações</Button>
          </form>
        </Card>

        <Card title="Aparência">
          <div className="space-y-4">
            <ThemeToggle />
          </div>
        </Card>

        <Card title="Segurança">
          <form className="space-y-4">
            <Input
              label="Senha Atual"
              type="password"
            />
            <Input
              label="Nova Senha"
              type="password"
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
            />
            <Button>Alterar Senha</Button>
          </form>
        </Card>

        <Card title="Notificações">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Emails de Lembrete</h4>
                <p className="text-sm text-gray-500">
                  Receba lembretes sobre prazos e compromissos
                </p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificações do Sistema</h4>
                <p className="text-sm text-gray-500">
                  Atualizações sobre casos e documentos
                </p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}