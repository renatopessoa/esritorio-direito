import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { MonthView } from '../components/calendar/MonthView';
import { EventForm } from '../components/calendar/EventForm';
import type { ViewMode, CalendarEvent } from '../types/calendar';
import { toast } from 'sonner';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handlePrevious = () => {
    // Implement previous navigation based on viewMode
  };

  const handleNext = () => {
    // Implement next navigation based on viewMode
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSubmit = async (data: CalendarEvent) => {
    try {
      // Implement event creation/update
      toast.success('Compromisso salvo com sucesso!');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar compromisso');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          onViewModeChange={setViewMode}
        />

        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Compromisso
        </Button>
      </div>

      {isFormOpen ? (
        <EventForm
          onSubmit={handleEventSubmit}
          onCancel={() => setIsFormOpen(false)}
          initialData={selectedEvent || undefined}
        />
      ) : (
        <MonthView
          currentDate={currentDate}
          events={[]} // Pass your events here
          onSelectDate={(date) => {
            setCurrentDate(date);
            setIsFormOpen(true);
          }}
          onEventClick={(event) => {
            setSelectedEvent(event);
            setIsFormOpen(true);
          }}
        />
      )}
    </div>
  );
}