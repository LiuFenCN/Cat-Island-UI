import * as React from 'react';
import { cn } from '../lib/cn';

export const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} type="range" className={cn('cathi-slider', className)} {...props} />
  ),
);
Slider.displayName = 'Slider';
