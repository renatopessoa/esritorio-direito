import { z } from 'zod';

export type ViewMode = 'month' | 'week' | 'day';

export type EventCategory = 'MEETING' | 'EVENT' | 'TASK' | 'HEARING' | 'DEADLINE' | 'OTHER';

export interface Reminder {
  type: 'EMAIL' | 'NOTIFICATION';
  minutes: number;
}

/** Evento como devolvido pela API (GET /calendar-events). Datas em ISO. */
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string | null;
  location: string | null;
  category: EventCategory;
  recurrence: { type?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'; interval?: number; until?: string } | null;
  participants: string[];
  reminders: Reminder[] | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(3, 'Título é obrigatório'),
    category: z.enum(['MEETING', 'EVENT', 'TASK', 'HEARING', 'DEADLINE', 'OTHER']),
    // valores de <input type="datetime-local">
    start: z.string().min(1, 'Informe o início'),
    end: z.string().min(1, 'Informe o término'),
    location: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((d) => new Date(d.end) >= new Date(d.start), {
    message: 'O término deve ser depois do início',
    path: ['end'],
  });

export type EventFormData = z.infer<typeof eventFormSchema>;

export const categoryLabels: Record<EventCategory, string> = {
  MEETING: 'Reunião',
  EVENT: 'Evento',
  TASK: 'Tarefa',
  HEARING: 'Audiência',
  DEADLINE: 'Prazo',
  OTHER: 'Outro',
};

export const categoryColors: Record<EventCategory, string> = {
  MEETING: 'bg-blue-500',
  EVENT: 'bg-purple-500',
  TASK: 'bg-green-500',
  HEARING: 'bg-red-500',
  DEADLINE: 'bg-yellow-500',
  OTHER: 'bg-gray-500',
};
