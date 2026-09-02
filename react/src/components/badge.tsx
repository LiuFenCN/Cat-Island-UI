import * as React from 'react';
import { cn } from '../lib/cn';

export type BadgeVariant = 'default' | 'primary' | 'amber' | 'destructive' | 'dot';

const variantClass: Record<BadgeVariant, string> = {
  default: '', primary: 'cathi-badge--primary', amber: 'cathi-badge--amber',
  destructive: 'cathi-badge--destructive', dot: 'cathi-badge--dot',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn('cathi-badge', variantClass[variant], className)} {...props} />;
}

/** 角标需要放在定位容器内（cathi-has-badge）。 */
export function BadgeAnchor({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('cathi-has-badge', className)} {...props}>
      {children}
    </span>
  );
}
