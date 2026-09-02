import * as React from 'react';
import { cn } from '../lib/cn';

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function Dialog({ open, onClose, className, children }: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={cn('cathi-dialog', className)} onClose={onClose}>
      {children}
    </dialog>
  );
}

export function DialogHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-dialog__header', className)} {...props}>{children}</div>;
}
export function DialogTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('cathi-dialog__title', className)} {...props}>{children}</h2>;
}
export function DialogDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('cathi-dialog__desc', className)} {...props}>{children}</p>;
}
export function DialogBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-dialog__body', className)} {...props}>{children}</div>;
}
export function DialogFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('cathi-dialog__footer', className)} {...props}>{children}</div>;
}

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function DialogClose({ className, children, onClick, ...props }: DialogCloseProps) {
  return (
    <button
      type="button"
      className={cn('cathi-dialog__close', className)}
      onClick={(e) => {
        (e.currentTarget.closest('dialog') as HTMLDialogElement | null)?.close();
        onClick?.(e);
      }}
      {...props}
    >
      {children ?? '×'}
    </button>
  );
}
