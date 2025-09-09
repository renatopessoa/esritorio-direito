import React from 'react';
import { UseFormRegister, FormState } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { maskCEP } from '../../utils/masks';
import type { UserFormData } from '../../types/user';

interface AddressFormProps {
  register: UseFormRegister<UserFormData>;
  formState: FormState<UserFormData>;
  onCepBlur: (cep: string) => Promise<void>;
}

export function AddressForm({ register, formState: { errors }, onCepBlur }: AddressFormProps) {
  return (
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
            onBlur: (e) => onCepBlur(e.target.value),
          })}
        />
        <div className="md:col-span-2">
          <Input
            label="Rua"
            error={!!errors.address?.street}
            errorMessage={errors.address?.street?.message}
            {...register('address.street')}
          />
        </div>
        <Input
          label="Número"
          error={!!errors.address?.number}
          errorMessage={errors.address?.number?.message}
          {...register('address.number')}
        />
        <Input
          label="Complemento"
          error={!!errors.address?.complement}
          errorMessage={errors.address?.complement?.message}
          {...register('address.complement')}
        />
        <Input
          label="Bairro"
          error={!!errors.address?.neighborhood}
          errorMessage={errors.address?.neighborhood?.message}
          {...register('address.neighborhood')}
        />
        <Input
          label="Cidade"
          error={!!errors.address?.city}
          errorMessage={errors.address?.city?.message}
          {...register('address.city')}
        />
        <Input
          label="Estado"
          maxLength={2}
          error={!!errors.address?.state}
          errorMessage={errors.address?.state?.message}
          {...register('address.state')}
        />
      </div>
    </Card>
  );
}