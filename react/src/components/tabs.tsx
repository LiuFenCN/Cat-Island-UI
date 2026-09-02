import * as React from 'react';
import { cn } from '../lib/cn';

export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function Tabs({ items, defaultValue, className }: TabsProps) {
  const [active, setActive] = React.useState(defaultValue ?? items[0]?.value);
  return (
    <div>
      <div className={cn('cathi-tabs', className)} role="tablist">
        {items.map((it) => (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={active === it.value}
            className="cathi-tab"
            data-state={active === it.value ? 'active' : undefined}
            onClick={() => setActive(it.value)}
          >
            {it.label}
          </button>
        ))}
      </div>
      {items.map((it) => (
        <div
          key={it.value}
          role="tabpanel"
          className="cathi-tab-panel"
          data-state={active === it.value ? 'active' : undefined}
        >
          {it.content}
        </div>
      ))}
    </div>
  );
}
