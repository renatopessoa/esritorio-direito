import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { addMonths, format, setHours, subMonths } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { MonthView } from '../components/calendar/MonthView';
import { EventForm } from '../components/calendar/EventForm';
import { monthGridRange } from '../components/calendar/range';
import { calendarService } from '../services/calendarService';
import { getErrorMessage } from '../lib/axios';
import type { CalendarEvent, EventFormData } from '../types/calendar';

// Formato aceito por <input type="datetime-local">, no fuso do navegador
const toLocalInput = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

type FormState = { event?: CalendarEvent; initialData: EventFormData } | null;

function newEventData(day: Date): EventFormData {
  const start = setHours(day, 9);
  return {
    title: '',
    category: 'MEETING',
    start: toLocalInput(start),
    end: toLocalInput(setHours(day, 10)),
    location: '',
    description: '',
  };
}

function editEventData(event: CalendarEvent): EventFormData {
  return {
    title: event.title,
    category: event.category,
    start: toLocalInput(new Date(event.start)),
    end: toLocalInput(new Date(event.end)),
    location: event.location ?? '',
    description: event.description ?? '',
  };
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [form, setForm] = useState<FormState>(null);

  const loadEvents = useCallback(async () => {
    const { start, end } = monthGridRange(currentDate);
    try {
      setEvents(await calendarService.list(start, end));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao carregar a agenda'));
    }
  }, [currentDate]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSubmit = async (data: EventFormData) => {
    const payload = {
      ...data,
      start: new Date(data.start).toISOString(),
      end: new Date(data.end).toISOString(),
    };
    try {
      if (form?.event) {
        await calendarService.update(form.event.id, payload);
      } else {
        await calendarService.create(payload);
      }
      toast.success('Compromisso salvo com sucesso!');
      setForm(null);
      loadEvents();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao salvar compromisso'));
    }
  };

  const handleDelete = async () => {
    if (!form?.event || !window.confirm(`Excluir "${form.event.title}"?`)) return;
    try {
      await calendarService.remove(form.event.id);
      toast.success('Compromisso excluído');
      setForm(null);
      loadEvents();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir compromisso'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CalendarHeader
          currentDate={currentDate}
          onPrevious={() => setCurrentDate((d) => subMonths(d, 1))}
          onNext={() => setCurrentDate((d) => addMonths(d, 1))}
          onToday={() => setCurrentDate(new Date())}
        />

        {!form && (
          <Button onClick={() => setForm({ initialData: newEventData(new Date()) })}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Compromisso
          </Button>
        )}
      </div>

      {form ? (
        <EventForm
          key={form.event?.id ?? 'new'}
          initialData={form.initialData}
          isEditing={!!form.event}
          onSubmit={handleSubmit}
          onCancel={() => setForm(null)}
          onDelete={handleDelete}
        />
      ) : (
        <MonthView
          currentDate={currentDate}
          events={events}
          onSelectDate={(date) => setForm({ initialData: newEventData(date) })}
          onEventClick={(event) => setForm({ event, initialData: editEventData(event) })}
        />
      )}
    </div>
  );
}
