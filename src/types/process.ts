import { z } from 'zod';

export type ProcessType = 'CIVIL' | 'CRIMINAL' | 'LABOR' | 'TAX' | 'OTHER';
export type ProcessStatus = 'ACTIVE' | 'ARCHIVED' | 'SUSPENDED';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type DeadlineType = 'HEARING' | 'PETITION' | 'MEETING' | 'OTHER';
export type DeadlineStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

export interface ProcessDeadline {
  id: string;
  processId: string;
  title: string;
  description: string | null;
  date: string;
  type: DeadlineType;
  status: DeadlineStatus;
}

export interface ProcessDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  version: number;
  uploadedAt: string;
}

/** Processo como devolvido pela API (GET /processes). */
export interface Process {
  id: string;
  number: string;
  clientId: string;
  responsibleId: string;
  type: ProcessType;
  subject: string;
  description: string | null;
  court: { name: string; district: string };
  value: number;
  status: ProcessStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  client: { id: string; name: string };
  responsible: { id: string; name: string };
  deadlines: ProcessDeadline[];
  documents: ProcessDocument[];
}

export const processTypeLabels: Record<ProcessType, string> = {
  CIVIL: 'Civil',
  CRIMINAL: 'Criminal',
  LABOR: 'Trabalhista',
  TAX: 'Tributário',
  OTHER: 'Outro',
};

export const priorityLabels: Record<Priority, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
};

export const deadlineTypeLabels: Record<DeadlineType, string> = {
  HEARING: 'Audiência',
  PETITION: 'Petição',
  MEETING: 'Reunião',
  OTHER: 'Outro',
};

export const processFormSchema = z.object({
  number: z.string().trim().min(1, 'Número do processo é obrigatório'),
  clientId: z.string({ required_error: 'Cliente é obrigatório' }).uuid('Cliente é obrigatório'),
  responsibleId: z.string().uuid('Responsável é obrigatório'),
  type: z.enum(['CIVIL', 'CRIMINAL', 'LABOR', 'TAX', 'OTHER'], { errorMap: () => ({ message: 'Selecione o tipo' }) }),
  subject: z.string().trim().min(3, 'Assunto é obrigatório'),
  description: z.string().optional(),
  court: z.object({
    name: z.string().trim().min(1, 'Vara é obrigatória'),
    district: z.string().trim().min(1, 'Comarca é obrigatória'),
  }),
  value: z.number({ invalid_type_error: 'Informe o valor da causa' }).min(0, 'Valor da causa inválido'),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'SUSPENDED']),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

export type ProcessFormData = z.infer<typeof processFormSchema>;

export const deadlineFormSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  // valor de <input type="datetime-local">
  date: z.string().min(1, 'Data é obrigatória'),
  type: z.enum(['HEARING', 'PETITION', 'MEETING', 'OTHER']),
});

export type DeadlineFormData = z.infer<typeof deadlineFormSchema>;
