import * as React from 'react';
import { cn } from '../lib/cn';

export function Accordion({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-accordion', className)} {...props}>{children}</div>;
}

export function AccordionItem({ open, className, children, ...props }: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return (
    <details className={cn('cathi-accordion__item', className)} open={open} {...props}>
      {children}
    </details>
  );
}

export function AccordionTrigger({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <summary className={cn('cathi-accordion__trigger', className)} {...props}>
      <span>{children}</span>
      <span className="cathi-accordion__icon">▾</span>
    </summary>
  );
}

export function AccordionContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-accordion__content', className)} {...props}>{children}</div>;
}
