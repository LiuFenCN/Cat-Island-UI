import * as React from 'react';
import { cn } from '../lib/cn';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn('cathi-label', className)} {...props} />
  ),
);
Label.displayName = 'Label';

export function Field({ label, help, error, htmlFor, children }: {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cathi-field">
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {help && !error && <span className="cathi-help">{help}</span>}
      {error && <span className="cathi-error">{error}</span>}
    </div>
  );
}
