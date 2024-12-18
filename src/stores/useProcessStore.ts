import { create } from 'zustand';
import type { Process } from '../types/process';

interface ProcessStore {
  processes: Process[];
  setProcesses: (processes: Process[]) => void;
  addProcess: (process: Process) => void;
  updateProcess: (id: string, data: Partial<Process>) => void;
  deleteProcess: (id: string) => void;
  getProcessById: (id: string) => Process | undefined;
}

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],
  setProcesses: (processes) => set({ processes }),
  addProcess: (process) =>
    set((state) => ({ processes: [...state.processes, process] })),
  updateProcess: (id, data) =>
    set((state) => ({
      processes: state.processes.map((process) =>
        process.id === id ? { ...process, ...data } : process
      ),
    })),
  deleteProcess: (id) =>
    set((state) => ({
      processes: state.processes.filter((process) => process.id !== id),
    })),
  getProcessById: (id) => get().processes.find((process) => process.id === id),
}));