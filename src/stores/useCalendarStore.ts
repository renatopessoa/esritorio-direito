import { create } from 'zustand';
import type { CalendarEvent } from '../types/calendar';

interface CalendarStore {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => CalendarEvent | undefined;
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsByDateRange: (start: Date, end: Date) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, data) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...data } : event
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  getEventById: (id) => get().events.find((event) => event.id === id),
  getEventsByDate: (date) => {
    const events = get().events;
    return events.filter(
      (event) =>
        event.start.toDateString() === date.toDateString() ||
        event.end.toDateString() === date.toDateString()
    );
  },
  getEventsByDateRange: (start, end) => {
    const events = get().events;
    return events.filter(
      (event) =>
        (event.start >= start && event.start <= end) ||
        (event.end >= start && event.end <= end)
    );
  },
}));