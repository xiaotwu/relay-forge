import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === overlayRef.current) {
      onClose();
    }
  };

  const modal = (
    <div
      ref={overlayRef}
      className="animate-in fade-in fixed inset-0 z-[1050] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={[
          'relative w-full rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl',
          'focus:outline-none',
          sizeClasses[size],
        ].join(' ')}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
            <h2 id="modal-title" className="text-lg font-semibold text-zinc-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 text-zinc-300">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center justify-end gap-3 border-t border-zinc-700 px-6 py-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
