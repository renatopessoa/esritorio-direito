import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-white capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          Hoje
        </Button>
        <Button variant="outline" size="sm" onClick={onPrevious} aria-label="Mês anterior">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} aria-label="Próximo mês">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
