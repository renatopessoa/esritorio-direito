import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FileUpload } from '../upload/FileUpload';
import { clientSchema, type Client } from '../../types/client';
import { maskCPF, maskCNPJ, maskPhone, maskCEP } from '../../utils/masks';
import { searchAddressByCep } from '../../services/viaCep';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: Client) => Promise<void>;
  onCancel: () => void;
}

export function ClientForm({ initialData, onSubmit, onCancel }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Client>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });

  const documentId = watch('documentId');
  const cep = watch('address.zipCode');

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('documentId', value.length <= 11 ? maskCPF(value) : maskCNPJ(value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', maskPhone(e.target.value));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('address.zipCode', maskCEP(value));
  };

  useEffect(() => {
    async function fetchAddress() {
      if (cep?.length === 8) {
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
    }
    fetchAddress();
  }, [cep, setValue]);

  const handleUploadDocuments = async (files: File[]) => {
    try {
      // Aqui você implementaria a lógica real de upload
      const uploadedDocs = files.map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      }));

      setValue('documents', uploadedDocs);
      toast.success('Documentos anexados com sucesso!');
    } catch (error) {
      toast.error('Erro ao anexar documentos');
    }
  };

  const handleFormSubmit = async (data: Client) => {
    try {
      await onSubmit(data);
      toast.success('Cliente salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card title="Dados Pessoais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome Completo"
            error={errors.name?.message}
            {...register('name')}
          />
          
          <Input
            label="CPF/CNPJ"
            value={documentId}
            onChange={handleDocumentChange}
            error={errors.documentId?.message}
          />
          
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            label="Telefone"
            onChange={handlePhoneChange}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </Card>

      <Card title="Endereço">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="CEP"
            onChange={handleCEPChange}
            error={errors.address?.zipCode?.message}
            {...register('address.zipCode')}
          />
          
          <div className="md:col-span-2">
            <Input
              label="Rua"
              error={errors.address?.street?.message}
              {...register('address.street')}
            />
          </div>
          
          <Input
            label="Número"
            error={errors.address?.number?.message}
            {...register('address.number')}
          />
          
          <Input
            label="Complemento"
            {...register('address.complement')}
          />
          
          <Input
            label="Bairro"
            error={errors.address?.neighborhood?.message}
            {...register('address.neighborhood')}
          />
          
          <Input
            label="Cidade"
            error={errors.address?.city?.message}
            {...register('address.city')}
          />
          
          <Input
            label="Estado"
            maxLength={2}
            error={errors.address?.state?.message}
            {...register('address.state')}
          />
        </div>
      </Card>

      <Card title="Documentos">
        <FileUpload
          onUpload={handleUploadDocuments}
          maxFiles={5}
          maxSize={10 * 1024 * 1024} // 10MB
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </Card>

      <Card title="Observações">
        <textarea
          className="input-dark w-full h-32 resize-none"
          placeholder="Observações adicionais sobre o cliente..."
          {...register('notes')}
        />
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  );
}