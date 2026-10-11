import * as React from 'react';
import { cn } from '../lib/cn';

export interface TabBarProps extends React.HTMLAttributes<HTMLElement> {}

export function TabBar({ className, children, ...props }: TabBarProps) {
  return (
    <nav className={cn('cathi-tabbar', className)} {...props}>
      {children}
    </nav>
  );
}

export interface TabBarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  active?: boolean;
}

export function TabBarItem({ icon, label, active, className, children, ...props }: TabBarItemProps) {
  return (
    <button
      type="button"
      className={cn('cathi-tabbar__item', className)}
      data-state={active ? 'active' : undefined}
      {...props}
    >
      {icon != null && <span className="ico">{icon}</span>}
      <span>{label ?? children}</span>
    </button>
  );
}
