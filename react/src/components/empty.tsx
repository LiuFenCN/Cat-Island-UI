import * as React from 'react';
import { cn } from '../lib/cn';

export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function Empty({ icon, title, description, className, children, ...props }: EmptyProps) {
  return (
    <div className={cn('cathi-empty', className)} {...props}>
      {icon != null && <div className="cathi-empty__icon">{icon}</div>}
      {title != null && <div className="cathi-empty__title">{title}</div>}
      {description != null && <div className="cathi-empty__desc">{description}</div>}
      {children}
    </div>
  );
}
