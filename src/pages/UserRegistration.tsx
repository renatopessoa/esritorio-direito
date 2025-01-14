import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AddressForm } from '../components/users/AddressForm';
import { PasswordStrengthIndicator } from '../components/users/PasswordStrengthIndicator';
import { createUser } from '../lib/supabase/queries/users';
import { userSchema, userRoles, positionsByRole, type UserFormData } from '../types/user';
import { maskCPF, maskPhone } from '../utils/masks';
import { searchAddressByCep } from '../services/viaCep';

export default function UserRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const password = watch('password');
  const selectedRole = watch('role');

  const handleCepBlur = async (cep: string) => {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        const address = await searchAddressByCep(cleanCep);
        setValue('address.street', address.logradouro);
        setValue('address.neighborhood', address.bairro);
        setValue('address.city', address.localidade);
        setValue('address.state', address.uf);
      }
    } catch (error) {
      toast.error('CEP não encontrado');
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      await createUser(data);
      toast.success('Usuário cadastrado com sucesso!');
      navigate('/app/settings');
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Erro ao cadastrar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Cadastro de Usuário</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Dados Pessoais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              error={errors.name?.message}
              {...register('name')}
            />
            
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Função
              </label>
              <select
                className="input-dark w-full"
                {...register('role')}
              >
                <option value="">Selecione uma função</option>
                {Object.entries(userRoles).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-sm text-red-400">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Cargo
              </label>
              <select
                className="input-dark w-full"
                {...register('position')}
                disabled={!selectedRole}
              >
                <option value="">Selecione um cargo</option>
                {selectedRole && positionsByRole[selectedRole]?.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              {errors.position && (
                <p className="text-sm text-red-400">{errors.position.message}</p>
              )}
            </div>
            
            <Input
              label="CPF"
              error={errors.cpf?.message}
              {...register('cpf', {
                onChange: (e) => {
                  e.target.value = maskCPF(e.target.value);
                },
              })}
            />
            
            <Input
              label="Data de Nascimento"
              type="date"
              error={errors.birthDate?.message}
              {...register('birthDate')}
            />
            
            <Input
              label="Celular"
              error={errors.phone?.message}
              {...register('phone', {
                onChange: (e) => {
                  e.target.value = maskPhone(e.target.value);
                },
              })}
            />
            
            <Input
              label="Telefone Fixo"
              {...register('landline', {
                onChange: (e) => {
                  e.target.value = maskPhone(e.target.value);
                },
              })}
            />
          </div>
        </Card>

        <Card title="Senha">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="Senha"
                type="password"
                error={errors.password?.message}
                {...register('password')}
              />
              <PasswordStrengthIndicator password={password || ''} />
            </div>
            
            <Input
              label="Confirmar Senha"
              type="password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
        </Card>

        <AddressForm
          register={register}
          formState={{ errors }}
          onCepBlur={handleCepBlur}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
}