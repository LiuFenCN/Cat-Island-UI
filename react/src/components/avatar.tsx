import * as React from 'react';
import { cn } from '../lib/cn';

export type AvatarSize = 'sm' | 'default' | 'lg';
export type AvatarShape = 'square' | 'round';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: AvatarSize;
  shape?: AvatarShape;
}

export function Avatar({ size = 'default', shape = 'square', className, ...props }: AvatarProps) {
  return (
    <img
      data-size={size === 'default' ? undefined : size}
      data-shape={shape === 'square' ? undefined : shape}
      className={cn('cathi-avatar', className)}
      {...props}
    />
  );
}

export function AvatarGroup({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('cathi-avatar-group', className)} {...props}>
      {children}
    </div>
  );
}
