import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { processSchema, type ProcessFormData } from '../../lib/validation/schemas';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ProcessFormProps {
  onSubmit: (data: ProcessFormData) => void;
  initialData?: Partial<ProcessFormData>;
}

export function ProcessForm({ onSubmit, initialData }: ProcessFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcessFormData>({
    resolver: zodResolver(processSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título"
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register('description')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-[100px]"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Prioridade
        </label>
        <select
          {...register('priority')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register('status')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="active">Ativo</option>
          <option value="pending">Pendente</option>
          <option value="closed">Encerrado</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
}