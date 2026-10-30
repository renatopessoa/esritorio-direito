import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endOfDay, format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Card } from '../ui/Card';
import { calendarService } from '../../services/calendarService';
import { getErrorMessage } from '../../lib/axios';
import { useAuthStore } from '../../stores/useAuthStore';
import { categoryColors, categoryLabels, type CalendarEvent } from '../../types/calendar';

// A API já devolve apenas os eventos do usuário logado
export function TodayAgenda() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);

  useEffect(() => {
    const now = new Date();
    calendarService
      .list(startOfDay(now), endOfDay(now))
      .then(setEvents)
      .catch((error) => {
        setEvents([]);
        toast.error(getErrorMessage(error, 'Erro ao carregar a agenda do dia'));
      });
  }, []);

  const title = user ? `Agenda de Hoje · ${user.name}` : 'Agenda de Hoje';
  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const now = Date.now();

  return (
    <Card title={title}>
      <p className="text-sm text-gray-400 capitalize mb-4">{today}</p>
      <div className="space-y-3">
        {events === null && (
          <p className="text-center py-4 text-gray-400">Carregando agenda...</p>
        )}
        {events?.map((event) => {
          const past = new Date(event.end).getTime() < now;
          return (
            <div
              key={event.id}
              className={`flex items-center gap-4 p-4 glass-card rounded-lg cursor-pointer hover:bg-white/5 transition-colors ${past ? 'opacity-50' : ''}`}
              onClick={() => navigate('/app/calendar')}
            >
              <div className="text-right shrink-0 w-24">
                <p className="font-medium text-white">{format(new Date(event.start), 'HH:mm')}</p>
                <p className="text-xs text-gray-400">até {format(new Date(event.end), 'HH:mm')}</p>
              </div>
              <span className={`w-1 self-stretch rounded-full ${categoryColors[event.category]}`} />
              <div className="min-w-0">
                <h4 className="font-medium text-white truncate">{event.title}</h4>
                <p className="text-gray-400 text-sm">
                  {categoryLabels[event.category]}
                  {event.location ? ` · ${event.location}` : ''}
                </p>
              </div>
            </div>
          );
        })}
        {events && events.length === 0 && (
          <p className="text-center py-4 text-gray-400">Nenhum compromisso para hoje</p>
        )}
      </div>
    </Card>
  );
}
