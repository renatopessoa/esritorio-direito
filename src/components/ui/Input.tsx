import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;  // Indica se há erro (booleano)
  errorMessage?: string;  // Mensagem de erro (string)
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, errorMessage, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
        <input
          className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className || ''}`}
          ref={ref}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';