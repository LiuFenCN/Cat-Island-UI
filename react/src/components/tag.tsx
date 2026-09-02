import * as React from 'react';
import { cn } from '../lib/cn';

export type TagVariant =
  | 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'
  | 'amber' | 'pink' | 'sky' | 'grape';

const variantAttr: Partial<Record<TagVariant, string>> = {
  secondary: 'secondary', outline: 'outline', destructive: 'destructive',
  success: 'success', warning: 'warning', info: 'info',
};
const variantClass: Partial<Record<TagVariant, string>> = {
  amber: 'cathi-tag--amber', pink: 'cathi-tag--pink', sky: 'cathi-tag--sky', grape: 'cathi-tag--grape',
};

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

export function Tag({ className, variant = 'default', ...props }: TagProps) {
  return (
    <span
      className={cn('cathi-tag', variantClass[variant], className)}
      data-variant={variantAttr[variant]}
      {...props}
    />
  );
}
