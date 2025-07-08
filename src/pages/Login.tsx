import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { BackgroundPattern } from '../components/landing/BackgroundPattern';
import { Scale } from 'lucide-react';
import { branding } from '../config/branding';

export default function Login() {
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
          <p className="text-gray-400 mt-2">Sistema de Gestão Jurídica</p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Links */}
        <div className="mt-6 text-center text-sm">
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            Esqueci minha senha
          </a>
          <span className="text-gray-600 mx-2">•</span>
          <Link to="/register" className="text-gray-400 hover:text-blue-400 transition-colors">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}