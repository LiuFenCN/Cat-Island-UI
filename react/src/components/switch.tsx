import * as React from 'react';
import { cn } from '../lib/cn';

export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <label className={cn('cathi-switch', className)}>
      <input ref={ref} type="checkbox" {...props} />
      <span className="cathi-switch__track" />
    </label>
  ),
);
Switch.displayName = 'Switch';
