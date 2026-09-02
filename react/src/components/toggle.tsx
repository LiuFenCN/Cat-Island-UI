import * as React from 'react';
import { cn } from '../lib/cn';

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  className,
  onClick,
  children,
  ...props
}: ToggleProps) {
  const [internal, setInternal] = React.useState(defaultPressed);
  const active = pressed ?? internal;
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn('cathi-toggle', className)}
      onClick={(e) => {
        onClick?.(e);
        const next = !active;
        setInternal(next);
        onPressedChange?.(next);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function ToggleGroup({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="group" className={cn('cathi-toggle-group', className)} {...props}>
      {children}
    </div>
  );
}
