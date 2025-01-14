import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ViewMode } from '../../types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
}: CalendarHeaderProps) {
  const formatTitle = () => {
    switch (viewMode) {
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: ptBR });
      case 'week':
        return `Semana de ${format(currentDate, 'd', { locale: ptBR })} de ${format(currentDate, 'MMMM yyyy', { locale: ptBR })}`;
      case 'day':
        return format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-white capitalize">
          {formatTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-card rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className={viewMode === 'month' ? 'bg-primary/20' : ''}
            onClick={() => onViewModeChange('month')}
          >
            Mês
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={viewMode === 'week' ? 'bg-primary/20' : ''}
            onClick={() => onViewModeChange('week')}
          >
            Semana
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={viewMode === 'day' ? 'bg-primary/20' : ''}
            onClick={() => onViewModeChange('day')}
          >
            Dia
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToday}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}