import { format, formatDistance, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return `Hoje, ${format(dateObj, 'HH:mm')}`;
  }

  if (isYesterday(dateObj)) {
    return `Ontem, ${format(dateObj, 'HH:mm')}`;
  }

  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { 
    addSuffix: true,
    locale: ptBR 
  });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatShortDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
}