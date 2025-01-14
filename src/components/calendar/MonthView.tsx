import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CalendarEvent } from '../../types/calendar';
import { categoryColors } from '../../types/calendar';

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
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const start = parseISO(event.start);
      const end = parseISO(event.end);
      return isWithinInterval(date, { start, end });
    });
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-white/10 rounded-lg overflow-hidden">
      {/* Weekday headers */}
      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
        <div
          key={day}
          className="bg-card p-2 text-center text-sm font-medium text-muted-foreground"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((date) => {
        const dayEvents = getEventsForDate(date);
        const isCurrentMonth = isSameMonth(date, currentDate);

        return (
          <div
            key={date.toISOString()}
            className={`
              min-h-[120px] p-2 bg-card transition-colors cursor-pointer
              hover:bg-white/5
              ${isToday(date) ? 'ring-2 ring-primary' : ''}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                >
                  {event.title}
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