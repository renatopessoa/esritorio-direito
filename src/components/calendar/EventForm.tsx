import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { eventSchema, type CalendarEvent } from '../../types/calendar';

interface EventFormProps {
  onSubmit: (data: CalendarEvent) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CalendarEvent>;
}

export function EventForm({ onSubmit, onCancel, initialData }: EventFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CalendarEvent>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...initialData,
      reminders: initialData?.reminders || [{ type: 'NOTIFICATION', minutes: 15 }],
    },
  });

  const isRecurrent = watch('recurrence.type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card title="Detalhes do Compromisso">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Título"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Categoria
            </label>
            <select
              className="input-dark w-full"
              {...register('category')}
            >
              <option value="MEETING">Reunião</option>
              <option value="EVENT">Evento</option>
              <option value="TASK">Tarefa</option>
              <option value="HEARING">Audiência</option>
              <option value="DEADLINE">Prazo</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>

          <Input
            type="datetime-local"
            label="Início"
            error={errors.start?.message}
            {...register('start')}
          />

          <Input
            type="datetime-local"
            label="Término"
            error={errors.end?.message}
            {...register('end')}
          />

          <div className="md:col-span-2">
            <Input
              label="Local"
              {...register('location')}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              className="input-dark w-full h-24 resize-none"
              {...register('description')}
            />
          </div>
        </div>
      </Card>

      <Card title="Recorrência">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tipo de Recorrência
            </label>
            <select
              className="input-dark w-full"
              {...register('recurrence.type')}
            >
              <option value="">Não se repete</option>
              <option value="DAILY">Diariamente</option>
              <option value="WEEKLY">Semanalmente</option>
              <option value="MONTHLY">Mensalmente</option>
              <option value="YEARLY">Anualmente</option>
            </select>
          </div>

          {isRecurrent && (
            <>
              <Input
                type="number"
                label="Intervalo"
                min={1}
                {...register('recurrence.interval', { valueAsNumber: true })}
              />

              <Input
                type="date"
                label="Repetir até"
                {...register('recurrence.until')}
              />
            </>
          )}
        </div>
      </Card>

      <Card title="Lembretes">
        <div className="space-y-4">
          <Controller
            name="reminders"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                {field.value?.map((reminder, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo de Lembrete
                      </label>
                      <select
                        className="input-dark w-full"
                        value={reminder.type}
                        onChange={(e) => {
                          const newReminders = [...field.value];
                          newReminders[index].type = e.target.value as 'EMAIL' | 'NOTIFICATION';
                          field.onChange(newReminders);
                        }}
                      >
                        <option value="EMAIL">Email</option>
                        <option value="NOTIFICATION">Notificação</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Minutos antes
                      </label>
                      <input
                        type="number"
                        className="input-dark w-full"
                        value={reminder.minutes}
                        onChange={(e) => {
                          const newReminders = [...field.value];
                          newReminders[index].minutes = Number(e.target.value);
                          field.onChange(newReminders);
                        }}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const newReminders = field.value.filter((_, i) => i !== index);
                        field.onChange(newReminders);
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    field.onChange([
                      ...field.value,
                      { type: 'NOTIFICATION', minutes: 15 },
                    ]);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Lembrete
                </Button>
              </div>
            )}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}