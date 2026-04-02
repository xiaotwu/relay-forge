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
    'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring-indigo-400',
  secondary:
    'bg-zinc-700 text-zinc-100 hover:bg-zinc-600 active:bg-zinc-500 focus-visible:ring-zinc-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400',
  ghost:
    'bg-transparent text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 focus-visible:ring-zinc-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
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
        'inline-flex items-center justify-center font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
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
