import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  addToast: (variant: ToastVariant, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCounter = 0;

const variantStyles: Record<ToastVariant, { bg: string; icon: string; border: string }> = {
  success: {
    bg: 'bg-[linear-gradient(180deg,rgba(var(--rf-surface),0.96),rgba(var(--rf-surface-muted),0.84))]',
    icon: 'text-[rgb(var(--rf-success))]',
    border: 'border-[rgba(var(--rf-success),0.22)]',
  },
  error: {
    bg: 'bg-[linear-gradient(180deg,rgba(var(--rf-surface),0.96),rgba(var(--rf-surface-muted),0.84))]',
    icon: 'text-[rgb(var(--rf-danger))]',
    border: 'border-[rgba(var(--rf-danger),0.22)]',
  },
  info: {
    bg: 'bg-[linear-gradient(180deg,rgba(var(--rf-surface),0.96),rgba(var(--rf-surface-muted),0.84))]',
    icon: 'text-[rgb(var(--rf-accent))]',
    border: 'border-[rgba(var(--rf-accent),0.18)]',
  },
};

const icons: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const ToastItem: React.FC<{
  toast: Toast;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const style = variantStyles[toast.variant];

  useEffect(() => {
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      timerRef.current = setTimeout(() => onRemove(toast.id), duration);
      return () => clearTimeout(timerRef.current);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={[
        'flex items-start gap-3 rounded-[22px] border px-4 py-3.5 shadow-[0_18px_40px_rgba(var(--rf-shadow-color),0.12)] backdrop-blur-xl',
        'transition-all duration-300 ease-out',
        style.bg,
        style.border,
      ].join(' ')}
      role="alert"
    >
      <span className={['mt-0.5 flex-shrink-0', style.icon].join(' ')}>{icons[toast.variant]}</span>
      <p className="flex-1 text-sm font-medium tracking-[-0.01em] text-[rgb(var(--rf-text-primary))]">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-[rgb(var(--rf-text-secondary))] transition-colors hover:text-[rgb(var(--rf-text-primary))]"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((variant: ToastVariant, message: string, duration?: number) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, variant, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-4 right-4 z-[1080] flex w-full max-w-sm flex-col gap-2">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
