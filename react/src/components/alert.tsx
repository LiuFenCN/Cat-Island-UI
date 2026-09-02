import * as React from 'react';
import { cn } from '../lib/cn';

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  icon?: React.ReactNode;
  title?: React.ReactNode;
}

export function Alert({ className, variant = 'default', icon, title, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      data-variant={variant === 'default' ? undefined : variant}
      className={cn('cathi-alert', className)}
      {...props}
    >
      {icon != null && <span className="cathi-alert__icon">{icon}</span>}
      <div className="cathi-alert__body">
        {title != null && <p className="cathi-alert__title">{title}</p>}
        <div className="cathi-alert__desc">{children}</div>
      </div>
    </div>
  );
}
