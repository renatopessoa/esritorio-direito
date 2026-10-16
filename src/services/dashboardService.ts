import { endOfDay, endOfMonth, format, startOfDay, startOfMonth } from 'date-fns';
import api from '../lib/axios';
import type { CalendarEvent } from '../types/calendar';
import type { ProcessDeadline } from '../types/process';

export interface DashboardData {
  activeProcesses: number;
  weekDeadlines: number;
  hearingsToday: number;
  /** null quando o usuário não tem acesso ao financeiro */
  monthlyIncome: number | null;
  upcomingDeadlines: Array<ProcessDeadline & { process: { id: string; number: string; client: { name: string } } }>;
  upcomingEvents: CalendarEvent[];
}

export const dashboardService = {
  async get(): Promise<DashboardData> {
    // "Hoje" e "este mês" no fuso do navegador
    const now = new Date();
    const { data } = await api.get<DashboardData>('/dashboard', {
      params: {
        dayStart: startOfDay(now).toISOString(),
        dayEnd: endOfDay(now).toISOString(),
        monthFrom: format(startOfMonth(now), 'yyyy-MM-dd'),
        monthTo: format(endOfMonth(now), 'yyyy-MM-dd'),
      },
    });
    return data;
  },
};
