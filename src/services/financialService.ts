import api from '../lib/axios';
import type {
  FinancialFormData,
  FinancialRecord,
  FinancialStatus,
  FinancialSummary,
  FinancialType,
} from '../types/financial';

export interface FinancialFilters {
  from?: string;
  to?: string;
  type?: FinancialType;
  status?: FinancialStatus;
}

export type FinancialPayload = Omit<FinancialFormData, 'dueDate'> & { dueDate?: string | null };

export const financialService = {
  async list(filters: FinancialFilters = {}): Promise<FinancialRecord[]> {
    const { data } = await api.get<FinancialRecord[]>('/financial', { params: filters });
    return data;
  },

  async summary(filters: FinancialFilters = {}): Promise<FinancialSummary> {
    const { data } = await api.get<FinancialSummary>('/financial/summary', { params: filters });
    return data;
  },

  async create(payload: FinancialPayload): Promise<FinancialRecord> {
    const { data } = await api.post<FinancialRecord>('/financial', payload);
    return data;
  },

  async update(id: string, payload: Partial<FinancialPayload>): Promise<FinancialRecord> {
    const { data } = await api.put<FinancialRecord>(`/financial/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/financial/${id}`);
  },
};
