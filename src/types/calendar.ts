import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, 'Título é obrigatório'),
  description: z.string().optional(),
  start: z.date(),
  end: z.date(),
  type: z.enum(['HEARING', 'MEETING', 'DEADLINE', 'OTHER']),
  location: z.string().optional(),
  processId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  participants: z.array(z.string().uuid()).optional(),
  notification: z.object({
    email: z.boolean(),
    push: z.boolean(),
    minutes: z.number(),
  }).optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED']),
  recurrence: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
    interval: z.number(),
    endDate: z.date(),
  }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CalendarEvent = z.infer<typeof eventSchema>;