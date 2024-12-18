import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'input-dark w-full rounded-lg px-3 py-2 shadow-sm',
            {
              'border-red-500': error,
            },
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={clsx('text-sm', error ? 'text-red-500' : 'text-muted-foreground')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);