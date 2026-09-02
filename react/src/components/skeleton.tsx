import * as React from 'react';
import { cn } from '../lib/cn';

export type SkeletonShape = 'default' | 'circle' | 'text';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
}

export function Skeleton({ className, shape = 'default', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      data-shape={shape === 'default' ? undefined : shape}
      className={cn('cathi-skeleton', className)}
      {...props}
    />
  );
}
