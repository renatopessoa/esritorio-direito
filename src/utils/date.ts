import { format, isToday, isYesterday, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: string | Date | null): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    if (isToday(dateObj)) {
      return `Hoje, ${format(dateObj, 'HH:mm')}`;
    }

    if (isYesterday(dateObj)) {
      return `Ontem, ${format(dateObj, 'HH:mm')}`;
    }

    return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}

export function formatRelativeDate(date: string | Date | null): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    return formatDistance(dateObj, new Date(), { 
      addSuffix: true,
      locale: ptBR 
    });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return '-';
  }
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '-';
  }
}

export function formatShortDate(date: string | Date | null): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    return format(dateObj, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting short date:', error);
    return '-';
  }
}