import * as React from 'react';
import { cn } from '../lib/cn';

interface RadioGroupContextValue {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}
const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const current = value ?? internal;
  const ctx: RadioGroupContextValue = {
    name,
    value: current,
    onValueChange: (v) => {
      setInternal(v);
      onValueChange?.(v);
    },
  };
  return (
    <RadioGroupContext.Provider value={ctx}>
      <div role="radiogroup" className={cn(className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'name' | 'checked'> {
  value: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
}

export function RadioItem({ value, label, hint, className, disabled, ...props }: RadioItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  const checked = ctx.value === value;
  return (
    <label className={cn('cathi-option', className)} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <input
        type="radio"
        className="cathi-radio"
        name={ctx.name}
        checked={checked}
        disabled={disabled}
        onChange={() => ctx.onValueChange?.(value)}
        {...props}
      />
      <span className="cathi-option__body">
        {label != null && <span>{label}</span>}
        {hint != null && <span className="cathi-option__hint">{hint}</span>}
      </span>
    </label>
  );
}
