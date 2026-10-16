import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

/** Intervalo exibido na grade do mês: semanas completas, de domingo a sábado. */
export function monthGridRange(date: Date) {
  return {
    start: startOfWeek(startOfMonth(date)),
    end: endOfWeek(endOfMonth(date)),
  };
}
