import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ className, title, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'glass-card rounded-xl overflow-hidden transition-all duration-200',
        className
      )}
      {...props}
    >
      {title && (
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}