import * as React from 'react';
import { cn } from '../lib/cn';

export type ToastVariant = 'default' | 'warn' | 'error' | 'success';

interface ToastItem {
  id: number;
  message: React.ReactNode;
  variant: ToastVariant;
  duration: number;
  leaving?: boolean;
}

interface ToastContextValue {
  toast: (message: React.ReactNode, opts?: { variant?: ToastVariant; duration?: number }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, React.ReactNode> = {
  default: 'ℹ',
  warn: '⚠',
  error: '⛔',
  success: '✓',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);

  const toast = React.useCallback<ToastContextValue['toast']>((message, opts) => {
    const id = ++idRef.current;
    const duration = opts?.duration ?? 3000;
    const variant = opts?.variant ?? 'default';
    setItems((prev) => [...prev, { id, message, variant, duration }]);
    window.setTimeout(() => {
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 300);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="cathi-toast-wrap">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'cathi-toast',
              t.variant !== 'default' && `cathi-toast--${t.variant}`,
              t.leaving && 'is-out',
            )}
            data-variant={t.variant !== 'default' ? t.variant : undefined}
            role="status"
          >
            <span className="cathi-toast__icon">{ICONS[t.variant]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast 必须在 <ToastProvider> 内使用');
  return ctx;
}
