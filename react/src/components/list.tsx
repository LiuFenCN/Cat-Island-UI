import * as React from 'react';
import { cn } from '../lib/cn';

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function List({ className, children, ...props }: ListProps) {
  return (
    <div className={cn('cathi-list', className)} {...props}>
      {children}
    </div>
  );
}

export interface ListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  iconColor?: 'amber' | 'pink' | 'sky' | 'grape';
  title?: React.ReactNode;
  sub?: React.ReactNode;
  chevron?: boolean;
  link?: boolean;
}

export function ListRow({ icon, iconColor, title, sub, chevron, link, className, children, ...props }: ListRowProps) {
  return (
    <div className={cn('cathi-list__row', link && 'cathi-list__row--link', className)} {...props}>
      {icon != null && (
        <div className={cn('cathi-list__icon', iconColor && `cathi-list__icon--${iconColor}`)}>{icon}</div>
      )}
      <div className="cathi-list__body">
        {title != null && <div className="cathi-list__title">{title}</div>}
        {sub != null && <div className="cathi-list__sub">{sub}</div>}
        {children}
      </div>
      {chevron && <div className="cathi-list__chevron">›</div>}
    </div>
  );
}
