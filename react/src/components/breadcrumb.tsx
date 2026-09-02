import * as React from 'react';
import { cn } from '../lib/cn';

export function Breadcrumb({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav aria-label="breadcrumb" className={cn('cathi-breadcrumb', className)} {...props}>
      {children}
    </nav>
  );
}

export function BreadcrumbItem({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('cathi-breadcrumb__item', className)} {...props}>
      {children}
    </span>
  );
}

export function BreadcrumbLink({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn('cathi-breadcrumb__link', className)} {...props} />;
}

export function BreadcrumbPage({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span aria-current="page" className={cn('cathi-breadcrumb__page', className)} {...props} />;
}

/** 分隔符（默认 /）。 */
export function BreadcrumbSep({ children = '/', className }: { children?: React.ReactNode; className?: string }) {
  return <span className={cn('cathi-muted', className)} aria-hidden="true">{children}</span>;
}
