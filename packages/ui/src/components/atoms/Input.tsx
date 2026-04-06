import React, { forwardRef, useId } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: 'min-h-10 px-3.5 py-2 text-sm',
  md: 'min-h-11 px-4 py-2.5 text-sm',
  lg: 'min-h-12 px-4.5 py-3 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    size = 'md',
    fullWidth = true,
    className = '',
    id: externalId,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const hasError = !!error;

  return (
    <div className={fullWidth ? 'w-full' : 'inline-flex flex-col'}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium tracking-[-0.01em] text-[rgb(var(--rf-text-secondary))]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[rgb(var(--rf-text-secondary))]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            'block appearance-none rounded-[18px] border text-[rgb(var(--rf-input-text))] caret-[rgb(var(--rf-input-text))] [-webkit-text-fill-color:rgb(var(--rf-input-text))] placeholder:text-[rgba(var(--rf-input-placeholder),0.98)] placeholder:opacity-100',
            'bg-[linear-gradient(180deg,rgba(var(--rf-input-bg),0.98),rgba(var(--rf-input-bg-strong),0.98))]',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_6px_14px_rgba(var(--rf-shadow-color),0.06)]',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            hasError
              ? 'border-[rgba(var(--rf-danger),0.44)] focus:ring-[rgba(var(--rf-danger),0.18)]'
              : 'border-[rgba(var(--rf-input-border),0.92)] focus:border-[rgba(var(--rf-accent),0.52)] focus:shadow-[0_0_0_1px_rgba(var(--rf-accent),0.08),0_14px_28px_rgba(var(--rf-shadow-color),0.12)] focus:ring-[rgba(var(--rf-accent),0.18)]',
            'disabled:saturate-75 disabled:cursor-not-allowed disabled:opacity-50',
            sizeClasses[size],
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            fullWidth ? 'w-full' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[rgb(var(--rf-text-secondary))]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-[rgb(var(--rf-danger))]">{error}</p>}
      {!error && hint && (
        <p className="mt-2 text-sm text-[rgb(var(--rf-text-secondary))]">{hint}</p>
      )}
    </div>
  );
});
