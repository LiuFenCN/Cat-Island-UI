import * as React from 'react';
import { cn } from '../lib/cn';
import { DialogBody, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './dialog';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  side?: SheetSide;
  closeOnOutside?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Sheet({ open, onClose, side = 'right', closeOnOutside = true, closeOnEsc = true, className, children }: SheetProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

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
      className={cn('cathi-dialog', 'cathi-sheet', className)}
      data-side={side}
      data-state={open ? 'open' : 'closed'}
      onClick={(e) => { if (closeOnOutside && e.target === e.currentTarget) ref.current?.close(); }}
    >
      {children}
    </dialog>
  );
}

export { DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose };
