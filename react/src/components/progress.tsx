import * as React from 'react';
import { cn } from '../lib/cn';

export type ProgressVariant = 'default' | 'amber' | 'pink';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: ProgressVariant;
  striped?: boolean;
  label?: React.ReactNode;
  showLabel?: boolean;
}

export function Progress({
  value = 0,
  variant = 'default',
  striped,
  label,
  showLabel = true,
  className,
  ...props
}: ProgressProps) {
  return (
    <div>
      {showLabel && (
        <div className="cathi-progress__label">
          <span>{label}</span>
          <span
            className={cn(
              'cathi-progress__pct',
              variant === 'amber' && 'cathi-progress__pct--amber',
            )}
          >
            {Math.round(value)}%
          </span>
        </div>
      )}
      <div
        className={cn('cathi-progress', striped && 'cathi-progress--striped', className)}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div
          className={cn(
            'cathi-progress__fill',
            variant === 'amber' && 'cathi-progress__fill--amber',
            variant === 'pink' && 'cathi-progress__fill--pink',
          )}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
