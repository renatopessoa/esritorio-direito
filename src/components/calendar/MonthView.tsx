import {
  eachDayOfInterval,
  endOfDay,
  format,
  isSameMonth,
  isToday,
  startOfDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CalendarEvent } from '../../types/calendar';
import { categoryColors } from '../../types/calendar';
import { monthGridRange } from './range';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function MonthView({
  currentDate,
  events,
  onSelectDate,
  onEventClick,
}: MonthViewProps) {
  // Semanas completas (domingo a sábado) para o 1º dia cair na coluna certa
  const days = eachDayOfInterval(monthGridRange(currentDate));

  // Evento aparece em todo dia que ele ocupa, inclusive eventos com horário
  const getEventsForDate = (date: Date) => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    return events.filter((event) => new Date(event.start) <= dayEnd && new Date(event.end) >= dayStart);
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-white/10 rounded-lg overflow-hidden">
      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
        <div
          key={day}
          className="bg-card p-2 text-center text-sm font-medium text-muted-foreground"
        >
          {day}
        </div>
      ))}

      {days.map((date) => {
        const dayEvents = getEventsForDate(date);
        const isCurrentMonth = isSameMonth(date, currentDate);

        return (
          <div
            key={date.toISOString()}
            className={`
              min-h-[120px] p-2 bg-card transition-colors cursor-pointer
              hover:bg-white/5
              ${isToday(date) ? 'ring-2 ring-primary ring-inset' : ''}
              ${!isCurrentMonth ? 'opacity-50' : ''}
            `}
            onClick={() => onSelectDate(date)}
          >
            <div className="text-sm font-medium mb-1">
              {format(date, 'd', { locale: ptBR })}
            </div>

            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`
                    px-2 py-1 rounded text-xs font-medium truncate
                    ${categoryColors[event.category]} text-white
                    cursor-pointer hover:opacity-80 transition-opacity
                  `}
                  title={`${format(new Date(event.start), 'HH:mm')} ${event.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                >
                  {format(new Date(event.start), 'HH:mm')} {event.title}
                </div>
              ))}

              {dayEvents.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{dayEvents.length - 3} mais
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
