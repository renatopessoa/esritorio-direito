import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, 'Título é obrigatório'),
  start: z.string().datetime(),
  end: z.string().datetime(),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(['MEETING', 'EVENT', 'TASK', 'HEARING', 'DEADLINE', 'OTHER']),
  recurrence: z.object({
    type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
    interval: z.number().optional(),
    until: z.string().datetime().optional(),
  }).optional(),
  participants: z.array(z.string()).optional(),
  reminders: z.array(z.object({
    type: z.enum(['EMAIL', 'NOTIFICATION']),
    minutes: z.number(),
  })).optional(),
  color: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type CalendarEvent = z.infer<typeof eventSchema>;

export type ViewMode = 'month' | 'week' | 'day';

export type EventCategory = 'MEETING' | 'EVENT' | 'TASK' | 'HEARING' | 'DEADLINE' | 'OTHER';

export const categoryColors: Record<EventCategory, string> = {
  MEETING: 'bg-blue-500',
  EVENT: 'bg-purple-500',
  TASK: 'bg-green-500',
  HEARING: 'bg-red-500',
  DEADLINE: 'bg-yellow-500',
  OTHER: 'bg-gray-500',
};