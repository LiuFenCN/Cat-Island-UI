import * as React from 'react';
import { cn } from '../lib/cn';

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  closeOnOutside?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Dialog({ open, onClose, closeOnOutside = true, closeOnEsc = true, className, children }: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  // 同步 open 状态 <-> 原生 <dialog>
  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // body 滚动锁
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // close / cancel 事件（用 addEventListener 避免 JSX 事件类型差异与重复回调）
  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCloseEvt = () => onClose?.();
    const onCancelEvt = (e: Event) => { if (!closeOnEsc) e.preventDefault(); };
    d.addEventListener('close', onCloseEvt);
    d.addEventListener('cancel', onCancelEvt);
    return () => {
      d.removeEventListener('close', onCloseEvt);
      d.removeEventListener('cancel', onCancelEvt);
    };
  }, [onClose, closeOnEsc]);

  return (
    <dialog
      ref={ref}
      className={cn('cathi-dialog', className)}
      data-state={open ? 'open' : 'closed'}
      onClick={(e) => { if (closeOnOutside && e.target === e.currentTarget) ref.current?.close(); }}
    >
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
