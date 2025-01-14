import React, { useEffect, useState } from 'react';
import { ExternalLink, Bell } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LegalNewsItem } from './LegalNewsItem';
import { fetchLegalNews } from '../../services/legalNews';
import { toast } from 'sonner';

interface LegalNotice {
  title: string;
  date: string;
  content: string;
  url: string;
}

export function LegalNews() {
  const [notices, setNotices] = useState<LegalNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(3);

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    try {
      const data = await fetchLegalNews();
      setNotices(data);
    } catch (error) {
      console.error('Error loading notices:', error);
      toast.error('Erro ao carregar avisos do TJPE');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card title="Avisos do TJPE">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-medium">Últimos Avisos</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://portal.tjpe.jus.br/web/portal/comunicacao/agencia-de-noticias/avisos', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Todos
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">
              Carregando avisos...
            </div>
          ) : notices.length > 0 ? (
            <>
              {notices.slice(0, displayCount).map((notice, index) => (
                <LegalNewsItem
                  key={index}
                  title={notice.title}
                  date={notice.date}
                  content={notice.content}
                  onClick={() => window.open(notice.url, '_blank')}
                />
              ))}

              {displayCount < notices.length && (
                <div className="text-center pt-2">
                  <Button 
                    variant="ghost"
                    className="text-sm text-gray-400 hover:text-white"
                    onClick={() => setDisplayCount(prev => prev + 3)}
                  >
                    Ver mais avisos
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Nenhum aviso encontrado
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}