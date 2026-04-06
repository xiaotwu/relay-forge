import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-[rgba(var(--rf-accent),0.15)] bg-[linear-gradient(180deg,rgba(var(--rf-accent),0.94),rgba(var(--rf-accent-hover),0.96))] text-white shadow-[0_14px_28px_rgba(var(--rf-accent),0.22)] hover:shadow-[0_18px_34px_rgba(var(--rf-accent),0.28)] active:translate-y-px active:bg-[rgb(var(--rf-accent-hover))] focus-visible:ring-[rgba(var(--rf-accent),0.28)]',
  secondary:
    'border border-[rgba(var(--rf-border),0.16)] bg-[linear-gradient(180deg,rgba(var(--rf-surface),0.96),rgba(var(--rf-surface-muted),0.82))] text-[rgb(var(--rf-text-primary))] shadow-[0_10px_24px_rgba(var(--rf-shadow-color),0.06)] hover:bg-[rgba(var(--rf-elevated),0.94)] hover:shadow-[0_14px_28px_rgba(var(--rf-shadow-color),0.09)] active:translate-y-px focus-visible:ring-[rgba(var(--rf-border),0.26)]',
  danger:
    'border border-[rgba(var(--rf-danger),0.18)] bg-[linear-gradient(180deg,rgba(var(--rf-danger),0.94),rgba(225,48,38,0.96))] text-white shadow-[0_14px_28px_rgba(var(--rf-danger),0.18)] hover:shadow-[0_18px_34px_rgba(var(--rf-danger),0.24)] active:translate-y-px focus-visible:ring-[rgba(var(--rf-danger),0.26)]',
  ghost:
    'border border-transparent bg-transparent text-[rgb(var(--rf-text-secondary))] hover:bg-[rgba(var(--rf-surface),0.76)] hover:text-[rgb(var(--rf-text-primary))] active:translate-y-px active:bg-[rgba(var(--rf-elevated),0.74)] focus-visible:ring-[rgba(var(--rf-border),0.22)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3.5 py-1.5 text-sm rounded-[14px] gap-1.5',
  md: 'min-h-11 px-4.5 py-2.5 text-sm rounded-[16px] gap-2',
  lg: 'min-h-12 px-6 py-3 text-base rounded-[18px] gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    className = '',
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold tracking-[-0.01em] transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--rf-base))]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'saturate-75 cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
