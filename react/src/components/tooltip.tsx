import * as React from 'react';
import { cn } from '../lib/cn';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  content: React.ReactNode;
  side?: TooltipSide;
}

export function Tooltip({ content, side = 'top', className, children, ...props }: TooltipProps) {
  return (
    <span className={cn('cathi-tooltip', className)} {...props}>
      {children}
      <span className="cathi-tooltip__bubble" data-side={side} role="tooltip">
        {content}
      </span>
    </span>
  );
}
