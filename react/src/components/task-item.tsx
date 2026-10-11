import * as React from 'react';
import { cn } from '../lib/cn';

export interface TaskItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  done?: boolean;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  onToggle?: (done: boolean) => void;
}

export function TaskItem({ done, icon, text, onToggle, className, children, ...props }: TaskItemProps) {
  return (
    <div className={cn('cathi-task-item', className)} data-state={done ? 'done' : undefined} {...props}>
      <button
        type="button"
        className="cathi-task-item__add"
        aria-pressed={done}
        aria-label={done ? '标记为未完成' : '标记为完成'}
        onClick={() => onToggle?.(!done)}
      >
        {done ? '✓' : (icon ?? '+')}
      </button>
      <div className="cathi-task-item__text">{text}{children}</div>
    </div>
  );
}
