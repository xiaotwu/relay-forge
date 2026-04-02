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
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
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
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            'block rounded-lg border bg-zinc-900 text-zinc-100 placeholder-zinc-500',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            hasError
              ? 'border-red-500 focus:ring-red-500/40'
              : 'border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-sm text-zinc-500">{hint}</p>}
    </div>
  );
});
