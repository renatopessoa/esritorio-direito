import React from "react";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Quando informado, renderiza um cabeçalho e envolve o conteúdo com padding. */
  title?: React.ReactNode;
}

export function Card({ className, title, children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ""}`}
      {...props}
    >
      {title ? (
        <>
          <div className="px-6 pt-5 pb-3 border-b border-white/10">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="p-6">{children}</div>
        </>
      ) : (
        children
      )}
    </div>
  );
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className || ""}`} {...props} />
  );
}

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={`text-2xl font-semibold ${className || ""}`} {...props} />;
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={`p-6 pt-0 ${className || ""}`} {...props} />;
}
