import * as React from 'react';
import { cn } from '../lib/cn';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-orientation={orientation}
      className={cn('cathi-separator', className)}
      {...props}
    />
  ),
);
Separator.displayName = 'Separator';
