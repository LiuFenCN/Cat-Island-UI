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

export function Option({ label, hint, className, children, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <label className={cn('cathi-option', className)} style={{ cursor: 'pointer' }}>
      <input type="checkbox" className="cathi-checkbox" {...props} />
      <span className="cathi-option__body">
        {label ?? children}
        {hint != null && <span className="cathi-option__hint">{hint}</span>}
      </span>
    </label>
  );
}
