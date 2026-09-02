import * as React from 'react';
import { cn } from '../lib/cn';

export function Table({ className, children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="cathi-table__container">
      <table className={cn('cathi-table', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export const THead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />;
export const TBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />;
export const Tr = (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />;
export const Th = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => <th {...props} />;
export const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => <td {...props} />;
