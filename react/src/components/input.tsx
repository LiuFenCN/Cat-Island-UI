import * as React from 'react';
import { cn } from '../lib/cn';

export type InputSize = 'sm' | 'default' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = 'default', invalid, ...props }, ref) => (
    <input
      ref={ref}
      data-size={size === 'default' ? undefined : size}
      aria-invalid={invalid || undefined}
      className={cn('cathi-input', className)}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn('cathi-textarea', className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<HTMLSelectElement, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & { size?: InputSize; invalid?: boolean }>(
  ({ className, size = 'default', invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      data-size={size === 'default' ? undefined : size}
      aria-invalid={invalid || undefined}
      className={cn('cathi-select', className)}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';
