import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { clientSchema, type ClientFormData } from '../../lib/validation/clientSchema';
import { maskCPF, maskCNPJ, maskPhone, maskCEP } from '../../utils/masks';
import { searchAddressByCep } from '../../services/viaCep';

export interface ClientFormProps {
  onSubmit: (data: any) => Promise<any>;
  isLoading?: boolean;
  initialData?: Partial<ClientFormData>;
  onCancel?: () => void;
  onDocumentsChange?: (files: File[]) => void;
}

export function ClientForm({
  onSubmit,
  isLoading = false,
  initialData = {},
  onCancel,
  onDocumentsChange
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      ...initialData,
      address: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        ...initialData?.address,
      },
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const address = await searchAddressByCep(cep);
        setValue('address.street', address.logradouro);
        setValue('address.neighborhood', address.bairro);
        setValue('address.city', address.localidade);
        setValue('address.state', address.uf);
      } catch (error) {
        toast.error('CEP não encontrado');
      }
    }
  };

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar cliente');
    }
  };

  // Atualiza os arquivos e notifica o componente pai
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      setFiles(fileList);

      if (onDocumentsChange) {
        onDocumentsChange(fileList);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card title="Dados Pessoais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome Completo"
            error={!!errors.name}
            errorMessage={errors.name?.message}
            {...register('name')} />

          <Input
            label="CPF/CNPJ"
            error={!!errors.documentId}
            errorMessage={errors.documentId?.message}
            {...register('documentId', {
              onChange: (e) => {
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = value.length <= 11 ? maskCPF(value) : maskCNPJ(value);
              },
            })} />

          <Input
            label="Email"
            type="email"
            error={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('email')} />

          <Input
            label="Telefone"
            error={!!errors.phone}
            errorMessage={errors.phone?.message}
            {...register('phone', {
              onChange: (e) => {
                e.target.value = maskPhone(e.target.value);
              },
            })} />
        </div>
      </Card>

      <Card title="Endereço">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="CEP"
            error={!!errors.address?.zipCode}
            errorMessage={errors.address?.zipCode?.message}
            {...register('address.zipCode', {
              onChange: (e) => {
                e.target.value = maskCEP(e.target.value);
              },
              onBlur: handleCepBlur,
            })} />

          <div className="md:col-span-2">
            <Input
              label="Rua"
              error={!!errors.address?.street}
              errorMessage={errors.address?.street?.message}
              {...register('address.street')} />
          </div>

          <Input
            label="Número"
            error={!!errors.address?.number}
            errorMessage={errors.address?.number?.message}
            {...register('address.number')} />

          <Input
            label="Complemento"
            {...register('address.complement')} />

          <Input
            label="Bairro"
            error={!!errors.address?.neighborhood}
            errorMessage={errors.address?.neighborhood?.message}
            {...register('address.neighborhood')} />

          <Input
            label="Cidade"
            error={!!errors.address?.city}
            errorMessage={errors.address?.city?.message}
            {...register('address.city')} />

          <Input
            label="Estado"
            maxLength={2}
            error={!!errors.address?.state}
            errorMessage={errors.address?.state?.message}
            {...register('address.state')} />
        </div>
      </Card>

      <Card title="Observações">
        <textarea
          className="input-dark w-full h-32 resize-none"
          placeholder="Observações adicionais sobre o cliente..."
          {...register('notes')} />
      </Card>

      <Card title="Documentos">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="documents"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="documents"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </span>
              Selecionar Documentos
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Documentos selecionados:</p>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <span className="mr-2">📄</span>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG. Máximo 10MB por arquivo.
          </p>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  );
}