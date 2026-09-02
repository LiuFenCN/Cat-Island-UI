import * as React from 'react';
import { cn } from '../lib/cn';

export type ButtonVariant =
  | 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  | 'amber' | 'pink' | 'sky' | 'grape';
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

const variantClass: Record<ButtonVariant, string> = {
  default: '', secondary: 'cathi-btn--secondary', outline: 'cathi-btn--outline',
  ghost: 'cathi-btn--ghost', destructive: 'cathi-btn--destructive', link: 'cathi-btn--link',
  amber: 'cathi-btn--amber', pink: 'cathi-btn--pink', sky: 'cathi-btn--sky', grape: 'cathi-btn--grape',
};
const sizeClass: Record<ButtonSize, string> = {
  sm: 'cathi-btn--sm', default: '', lg: 'cathi-btn--lg', icon: 'cathi-btn--icon',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn('cathi-btn', variantClass[variant], sizeClass[size], className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
