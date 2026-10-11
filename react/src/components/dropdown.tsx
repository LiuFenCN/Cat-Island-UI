import * as React from 'react';
import { cn } from '../lib/cn';

export interface DropdownProps {
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  defaultOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Dropdown({ trigger, align = 'start', defaultOpen = false, className, children }: DropdownProps) {
  const ref = React.useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = React.useState(defaultOpen);

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    setOpen(e.currentTarget.open);
  };

  // 外部点击关闭 + Esc 关闭（仅展开时挂载监听）
  React.useEffect(() => {
    if (!open) return;
    const root = ref.current;
    if (!root) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!root.contains(e.target as Node)) root.open = false; // 触发 toggle -> setOpen(false)
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && root.open) {
        root.open = false;
        e.preventDefault();
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open]);

  const moveFocus = (dir: 1 | -1 | 'first' | 'last') => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('.cathi-dropdown__item'));
    if (!items.length) return;
    const active = document.activeElement as HTMLElement | null;
    let idx = items.indexOf(active as HTMLElement);
    if (dir === 'first') idx = 0;
    else if (dir === 'last') idx = items.length - 1;
    else idx = idx < 0 ? 0 : (idx + dir + items.length) % items.length;
    items[idx]?.focus();
  };

  const onSummaryKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const root = ref.current;
        if (root) root.open = true; // 触发 toggle -> setOpen(true)
        window.setTimeout(() => moveFocus('first'), 0);
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1); }
    else if (e.key === 'Home') { e.preventDefault(); moveFocus('first'); }
    else if (e.key === 'End') { e.preventDefault(); moveFocus('last'); }
  };

  return (
    <details
      ref={ref}
      className={cn('cathi-dropdown', className)}
      data-align={align}
      data-state={open ? 'open' : 'closed'}
      onToggle={handleToggle}
    >
      <summary
        className="cathi-dropdown__trigger cathi-btn cathi-btn--outline"
        aria-haspopup="menu"
        aria-expanded={open}
        onKeyDown={onSummaryKeyDown}
      >
        {trigger}
      </summary>
      <div className="cathi-dropdown__menu" role="menu">
        {children}
      </div>
    </details>
  );
}

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive';
  shortcut?: React.ReactNode;
  closeOnSelect?: boolean;
}

export function DropdownItem({ variant, shortcut, className, children, closeOnSelect = true, onClick, ...props }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn('cathi-dropdown__item', className)}
      data-variant={variant === 'destructive' ? 'destructive' : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (closeOnSelect && !e.defaultPrevented) {
          const details = e.currentTarget.closest('details') as HTMLDetailsElement | null;
          if (details) details.open = false;
        }
      }}
      {...props}
    >
      {children}
      {shortcut != null && <span className="cathi-dropdown__shortcut">{shortcut}</span>}
    </button>
  );
}

export function DropdownLabel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-dropdown__label', className)} role="presentation" {...props}>{children}</div>;
}

export function DropdownSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-dropdown__separator', className)} role="separator" aria-orientation="horizontal" {...props} />;
}
