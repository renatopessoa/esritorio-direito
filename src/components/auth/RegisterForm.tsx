import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { BackgroundPattern } from '../landing/BackgroundPattern';
import { Scale } from 'lucide-react';
import { branding } from '../../config/branding';

const registerSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
    role: z.enum(['admin', 'lawyer', 'assistant']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser } = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            await registerUser(data.email, data.password, {
                name: data.name,
                role: data.role,
            });
            toast.success('Conta criada com sucesso! Verifique seu email para ativar a conta.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar conta');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'lawyer':
                return 'Advogado';
            case 'assistant':
                return 'Assistente';
            default:
                return 'Usuário';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <BackgroundPattern />

            <div className="w-full max-w-md relative">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <Scale className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {branding.name}
                    </h1>
                    <p className="text-gray-400 mt-2">Criar Nova Conta</p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="glass-card p-6 rounded-xl border border-white/10">
                        <div className="space-y-4">
                            {/* Nome */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="input-dark w-full"
                                    placeholder="Digite seu nome completo"
                                    {...register('name')}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="input-dark w-full"
                                    placeholder="Digite seu email"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                                    Função
                                </label>
                                <select
                                    id="role"
                                    className="input-dark w-full"
                                    {...register('role')}
                                >
                                    <option value="">Selecione uma função</option>
                                    <option value="assistant">{getRoleLabel('assistant')}</option>
                                    <option value="lawyer">{getRoleLabel('lawyer')}</option>
                                    <option value="admin">{getRoleLabel('admin')}</option>
                                </select>
                                {errors.role && (
                                    <p className="text-sm text-red-400 mt-1">{errors.role.message}</p>
                                )}
                            </div>

                            {/* Senha */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="input-dark w-full"
                                    placeholder="Digite sua senha"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="input-dark w-full"
                                    placeholder="Confirme sua senha"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-400 mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? 'Criando conta...' : 'Criar Conta'}
                        </button>
                    </div>
                </form>

                {/* Links */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-400">Já tem uma conta? </span>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Fazer login
                    </button>
                </div>
            </div>
        </div>
    );
}
