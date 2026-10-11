import * as React from 'react';
import { cn } from '../lib/cn';

export interface SearchBarProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  buttonLabel?: React.ReactNode;
}

export function SearchBar({
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  placeholder,
  icon = '🔍',
  buttonLabel = '搜索',
  className,
  ...props
}: SearchBarProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const current = value ?? internal;
  return (
    <form
      className={cn('cathi-search-bar', className)}
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(current); }}
      {...props}
    >
      {icon != null && <span className="cathi-search-bar__icon">{icon}</span>}
      <input
        className="cathi-search-bar__input"
        value={current}
        placeholder={placeholder}
        onChange={(e) => { setInternal(e.target.value); onValueChange?.(e.target.value); }}
      />
      {buttonLabel != null && <button type="submit" className="cathi-search-bar__btn">{buttonLabel}</button>}
    </form>
  );
}
