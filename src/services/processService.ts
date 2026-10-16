import api from '../lib/axios';
import type { DeadlineStatus, DeadlineType, Process, ProcessDeadline, ProcessFormData, ProcessStatus } from '../types/process';

export interface ProcessFilters {
  search?: string;
  status?: ProcessStatus;
  clientId?: string;
}

export interface DeadlinePayload {
  title: string;
  description?: string;
  date: string; // ISO
  type: DeadlineType;
  status?: DeadlineStatus;
}

export type UpcomingDeadline = ProcessDeadline & {
  process: { id: string; number: string; subject: string };
};

export const processService = {
  async list(filters: ProcessFilters = {}): Promise<Process[]> {
    const { data } = await api.get<Process[]>('/processes', { params: filters });
    return data;
  },

  async create(payload: ProcessFormData): Promise<Process> {
    const { data } = await api.post<Process>('/processes', payload);
    return data;
  },

  async update(id: string, payload: Partial<ProcessFormData>): Promise<Process> {
    const { data } = await api.put<Process>(`/processes/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/processes/${id}`);
  },

  async addDeadline(processId: string, payload: DeadlinePayload): Promise<ProcessDeadline> {
    const { data } = await api.post<ProcessDeadline>(`/processes/${processId}/deadlines`, payload);
    return data;
  },

  async updateDeadline(id: string, payload: Partial<DeadlinePayload>): Promise<ProcessDeadline> {
    const { data } = await api.put<ProcessDeadline>(`/deadlines/${id}`, payload);
    return data;
  },

  async removeDeadline(id: string): Promise<void> {
    await api.delete(`/deadlines/${id}`);
  },

  async upcomingDeadlines(days = 7): Promise<UpcomingDeadline[]> {
    const { data } = await api.get<UpcomingDeadline[]>('/deadlines/upcoming', { params: { days } });
    return data;
  },
};
