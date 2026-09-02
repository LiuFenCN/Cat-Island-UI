import * as React from 'react';
import { cn } from '../lib/cn';

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} type="checkbox" className={cn('cathi-checkbox', className)} {...props} />
  ),
);
Checkbox.displayName = 'Checkbox';

export const Radio = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} type="radio" className={cn('cathi-radio', className)} {...props} />
  ),
);
Radio.displayName = 'Radio';

export function Option({ label, className, children, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: React.ReactNode }) {
  return (
    <label className={cn('cathi-option', className)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, cursor: 'pointer' }}>
      <input type="checkbox" className="cathi-checkbox" {...props} />
      {label ?? children}
    </label>
  );
}
