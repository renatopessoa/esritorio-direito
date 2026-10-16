import api from '../lib/axios';
import type { CalendarEvent, EventCategory } from '../types/calendar';

export interface EventPayload {
  title: string;
  category: EventCategory;
  start: string; // ISO
  end: string; // ISO
  location?: string;
  description?: string;
}

export const calendarService = {
  async list(from: Date, to: Date): Promise<CalendarEvent[]> {
    const { data } = await api.get<CalendarEvent[]>('/calendar-events', {
      params: { from: from.toISOString(), to: to.toISOString() },
    });
    return data;
  },

  async create(payload: EventPayload): Promise<CalendarEvent> {
    const { data } = await api.post<CalendarEvent>('/calendar-events', payload);
    return data;
  },

  async update(id: string, payload: Partial<EventPayload>): Promise<CalendarEvent> {
    const { data } = await api.put<CalendarEvent>(`/calendar-events/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/calendar-events/${id}`);
  },
};
