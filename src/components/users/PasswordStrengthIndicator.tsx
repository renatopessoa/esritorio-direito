import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getStrength = (): { strength: number; label: string; color: string } => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthMap = {
      0: { label: 'Muito fraca', color: 'bg-red-500' },
      1: { label: 'Fraca', color: 'bg-orange-500' },
      2: { label: 'Média', color: 'bg-yellow-500' },
      3: { label: 'Forte', color: 'bg-blue-500' },
      4: { label: 'Muito forte', color: 'bg-green-500' },
      5: { label: 'Excelente', color: 'bg-green-600' },
    };

    return { 
      strength, 
      ...strengthMap[strength as keyof typeof strengthMap]
    };
  };

  const { strength, label, color } = getStrength();

  return (
    <div className="space-y-2">
      <div className="flex gap-1 h-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-full flex-1 rounded-full transition-colors ${
              index < strength ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Força da senha: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
}