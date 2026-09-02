import * as React from 'react';
import { cn } from '../lib/cn';

export type SpinnerSize = 'sm' | 'default' | 'lg';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
}

export function Spinner({ className, size = 'default', ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="加载中"
      data-size={size === 'default' ? undefined : size}
      className={cn('cathi-spinner', className)}
      {...props}
    />
  );
}

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <kbd className={cn('cathi-kbd', className)} {...props} />;
}
