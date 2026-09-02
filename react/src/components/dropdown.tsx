import * as React from 'react';
import { cn } from '../lib/cn';

export interface DropdownProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function Dropdown({ trigger, align = 'start', className, children, ...props }: DropdownProps) {
  return (
    <details className={cn('cathi-dropdown', className)} data-align={align} {...props}>
      <summary className="cathi-dropdown__trigger cathi-btn cathi-btn--outline">{trigger}</summary>
      <div className="cathi-dropdown__menu">{children}</div>
    </details>
  );
}

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive';
  shortcut?: React.ReactNode;
}

export function DropdownItem({ variant, shortcut, className, children, ...props }: DropdownItemProps) {
  return (
    <button
      type="button"
      className={cn('cathi-dropdown__item', className)}
      data-variant={variant === 'destructive' ? 'destructive' : undefined}
      {...props}
    >
      {children}
      {shortcut != null && <span className="cathi-dropdown__shortcut">{shortcut}</span>}
    </button>
  );
}

export function DropdownLabel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-dropdown__label', className)} {...props}>{children}</div>;
}

export function DropdownSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-dropdown__separator', className)} {...props} />;
}
