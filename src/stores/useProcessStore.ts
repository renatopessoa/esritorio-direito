import { create } from 'zustand';
import type { Process, ProcessDeadline, ProcessFormData } from '../types/process';
import { processService, type DeadlinePayload, type ProcessFilters } from '../services/processService';

interface ProcessStore {
  processes: Process[];
  isLoading: boolean;
  fetchProcesses: (filters?: ProcessFilters) => Promise<void>;
  createProcess: (data: ProcessFormData) => Promise<Process>;
  updateProcess: (id: string, data: Partial<ProcessFormData>) => Promise<Process>;
  deleteProcess: (id: string) => Promise<void>;
  addDeadline: (processId: string, data: DeadlinePayload) => Promise<void>;
  updateDeadline: (processId: string, deadlineId: string, data: Partial<DeadlinePayload>) => Promise<void>;
  removeDeadline: (processId: string, deadlineId: string) => Promise<void>;
  getProcessById: (id: string) => Process | undefined;
}

const byDate = (a: ProcessDeadline, b: ProcessDeadline) => a.date.localeCompare(b.date);

export const useProcessStore = create<ProcessStore>((set, get) => {
  const replaceProcess = (process: Process) =>
    set((state) => ({ processes: state.processes.map((p) => (p.id === process.id ? process : p)) }));

  const patchDeadlines = (processId: string, update: (deadlines: ProcessDeadline[]) => ProcessDeadline[]) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === processId ? { ...p, deadlines: update(p.deadlines).sort(byDate) } : p
      ),
    }));

  return {
    processes: [],
    isLoading: false,

    fetchProcesses: async (filters) => {
      set({ isLoading: true });
      try {
        set({ processes: await processService.list(filters) });
      } finally {
        set({ isLoading: false });
      }
    },

    createProcess: async (data) => {
      const process = await processService.create(data);
      set((state) => ({ processes: [process, ...state.processes] }));
      return process;
    },

    updateProcess: async (id, data) => {
      const process = await processService.update(id, data);
      replaceProcess(process);
      return process;
    },

    deleteProcess: async (id) => {
      await processService.remove(id);
      set((state) => ({ processes: state.processes.filter((p) => p.id !== id) }));
    },

    addDeadline: async (processId, data) => {
      const deadline = await processService.addDeadline(processId, data);
      patchDeadlines(processId, (deadlines) => [...deadlines, deadline]);
    },

    updateDeadline: async (processId, deadlineId, data) => {
      const deadline = await processService.updateDeadline(deadlineId, data);
      patchDeadlines(processId, (deadlines) => deadlines.map((d) => (d.id === deadlineId ? deadline : d)));
    },

    removeDeadline: async (processId, deadlineId) => {
      await processService.removeDeadline(deadlineId);
      patchDeadlines(processId, (deadlines) => deadlines.filter((d) => d.id !== deadlineId));
    },

    getProcessById: (id) => get().processes.find((p) => p.id === id),
  };
});
