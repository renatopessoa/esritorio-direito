import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { categoryLabels, eventFormSchema, type EventFormData } from '../../types/calendar';

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  initialData: EventFormData;
  isEditing: boolean;
}

export function EventForm({ onSubmit, onCancel, onDelete, initialData, isEditing }: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card title={isEditing ? 'Editar Compromisso' : 'Novo Compromisso'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Título"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Categoria
            </label>
            <select
              className="input-dark w-full h-10 rounded-md px-3"
              {...register('category')}
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
            <label className="block text-sm font-medium mb-1">
              Descrição
            </label>
            <textarea
              className="input-dark w-full h-24 resize-none rounded-md p-3"
              {...register('description')}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-between gap-3">
        <div>
          {isEditing && onDelete && (
            <Button type="button" variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </form>
  );
}
