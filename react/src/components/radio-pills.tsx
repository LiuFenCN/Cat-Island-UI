import * as React from 'react';
import { cn } from '../lib/cn';

export interface RadioPillsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

export interface RadioPillItemProps {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  checked?: boolean;
  onSelect?: (value: string) => void;
}

export function RadioPills({
  value,
  defaultValue,
  onValueChange,
  name,
  className,
  children,
  ...props
}: RadioPillsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const current = value ?? internal;
  return (
    <div role="radiogroup" className={cn('cathi-radio-pills', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const v = (child.props as RadioPillItemProps).value;
        return React.cloneElement(child as React.ReactElement<RadioPillItemProps>, {
          name,
          checked: current === v,
          onSelect: (val: string) => {
            setInternal(val);
            onValueChange?.(val);
          },
        });
      })}
    </div>
  );
}

export function RadioPillItem({
  value,
  children,
  disabled,
  name,
  checked,
  onSelect,
}: RadioPillItemProps) {
  return (
    <label className="cathi-radio-pill" data-state={checked ? 'on' : undefined}>
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect?.(value)}
      />
      <span>{children}</span>
    </label>
  );
}
