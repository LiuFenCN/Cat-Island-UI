import * as React from 'react';
import { cn } from '../lib/cn';

export interface SettingsPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
}

export function SettingsPanel({ title, className, children, ...props }: SettingsPanelProps) {
  return (
    <div className={cn('cathi-settings-panel', className)} {...props}>
      {title != null && <div className="cathi-settings-panel__title">{title}</div>}
      {children}
    </div>
  );
}

export interface SettingRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
}

export function SettingRow({ label, className, children, ...props }: SettingRowProps) {
  return (
    <div className={cn('cathi-setting-row', className)} {...props}>
      <div className="cathi-setting-row__label">{label}</div>
      {children}
    </div>
  );
}
