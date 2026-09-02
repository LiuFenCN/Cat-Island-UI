import * as React from 'react';
import { cn } from '../lib/cn';
import { DialogBody, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './dialog';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  side?: SheetSide;
  className?: string;
  children?: React.ReactNode;
}

export function Sheet({ open, onClose, side = 'right', className, children }: SheetProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={cn('cathi-dialog', 'cathi-sheet', className)} data-side={side} onClose={onClose}>
      {children}
    </dialog>
  );
}

export { DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose };
