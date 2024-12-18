import { create } from 'zustand';
import type { FinancialRecord } from '../types/financial';

interface FinancialStore {
  records: FinancialRecord[];
  setRecords: (records: FinancialRecord[]) => void;
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, data: Partial<FinancialRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordById: (id: string) => FinancialRecord | undefined;
  getBalance: () => number;
  getIncomeTotal: () => number;
  getExpenseTotal: () => number;
}

export const useFinancialStore = create<FinancialStore>((set, get) => ({
  records: [],
  setRecords: (records) => set({ records }),
  addRecord: (record) =>
    set((state) => ({ records: [...state.records, record] })),
  updateRecord: (id, data) =>
    set((state) => ({
      records: state.records.map((record) =>
        record.id === id ? { ...record, ...data } : record
      ),
    })),
  deleteRecord: (id) =>
    set((state) => ({
      records: state.records.filter((record) => record.id !== id),
    })),
  getRecordById: (id) => get().records.find((record) => record.id === id),
  getBalance: () => {
    const records = get().records;
    return records.reduce((acc, record) => {
      const amount = record.type === 'INCOME' ? record.amount : -record.amount;
      return acc + amount;
    }, 0);
  },
  getIncomeTotal: () => {
    const records = get().records;
    return records
      .filter((record) => record.type === 'INCOME')
      .reduce((acc, record) => acc + record.amount, 0);
  },
  getExpenseTotal: () => {
    const records = get().records;
    return records
      .filter((record) => record.type === 'EXPENSE')
      .reduce((acc, record) => acc + record.amount, 0);
  },
}));