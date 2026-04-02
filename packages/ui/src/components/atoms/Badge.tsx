import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  variant?: BadgeVariant;
  /** When provided, renders a numeric count badge (for unread/mention counts). */
  count?: number;
  /** Maximum count to display before showing "N+". */
  maxCount?: number;
  children?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-zinc-600 text-zinc-100',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-600 text-white',
  danger: 'bg-red-600 text-white',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  count,
  maxCount = 99,
  children,
  className = '',
}) => {
  const isCountMode = count !== undefined;

  if (isCountMode) {
    if (count <= 0) return null;

    const displayCount = count > maxCount ? `${maxCount}+` : String(count);

    return (
      <span
        className={[
          'inline-flex items-center justify-center rounded-full font-semibold',
          'h-5 min-w-[1.25rem] px-1.5 text-xs',
          variantClasses[variant],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {displayCount}
      </span>
    );
  }

  return (
    <span
      className={[
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
};
