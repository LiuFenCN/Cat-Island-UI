import * as React from 'react';
import { cn } from '../lib/cn';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <nav className={cn('cathi-sidebar-nav', className)} {...props}>
      {children}
    </nav>
  );
}

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
}

export function SidebarItem({ icon, active, className, children, ...props }: SidebarItemProps) {
  return (
    <a className={cn('cathi-nav-item', className)} data-state={active ? 'active' : undefined} {...props}>
      {icon != null && <span className="cathi-nav-item__icon">{icon}</span>}
      <span>{children}</span>
    </a>
  );
}
