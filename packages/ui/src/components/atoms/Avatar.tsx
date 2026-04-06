import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: 'online' | 'idle' | 'dnd' | 'offline' | null;
  className?: string;
  onClick?: () => void;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: 'h-6 w-6', text: 'text-[10px]', status: 'h-2 w-2 border' },
  sm: { container: 'h-8 w-8', text: 'text-xs', status: 'h-2.5 w-2.5 border-[1.5px]' },
  md: { container: 'h-10 w-10', text: 'text-sm', status: 'h-3 w-3 border-2' },
  lg: { container: 'h-12 w-12', text: 'text-base', status: 'h-3.5 w-3.5 border-2' },
  xl: { container: 'h-16 w-16', text: 'text-lg', status: 'h-4 w-4 border-2' },
};

const statusColorMap: Record<string, string> = {
  online: 'bg-[rgb(var(--rf-success))]',
  idle: 'bg-[rgb(var(--rf-warning))]',
  dnd: 'bg-[rgb(var(--rf-danger))]',
  offline: 'bg-[rgb(var(--rf-text-tertiary))]',
};

const statusRingMap: Record<string, string> = {
  online: 'shadow-[0_0_0_3px_rgba(var(--rf-success),0.16)]',
  idle: 'shadow-[0_0_0_3px_rgba(var(--rf-warning),0.16)]',
  dnd: 'shadow-[0_0_0_3px_rgba(var(--rf-danger),0.16)]',
  offline: 'shadow-[0_0_0_3px_rgba(var(--rf-text-tertiary),0.12)]',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 50%, 40%)`;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  status = null,
  className = '',
  onClick,
}) => {
  const sizeConfig = sizeMap[size];
  const [imgError, setImgError] = React.useState(false);
  const showImage = src && !imgError;

  return (
    <div
      className={['relative inline-flex shrink-0', onClick ? 'cursor-pointer' : '', className]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      <div
        className={[
          'flex items-center justify-center overflow-hidden rounded-full border border-[rgba(var(--rf-border),0.16)] font-semibold shadow-[0_10px_24px_rgba(var(--rf-shadow-color),0.08)]',
          sizeConfig.container,
          sizeConfig.text,
        ].join(' ')}
        style={!showImage ? { backgroundColor: hashColor(name) } : undefined}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="select-none text-white">{name ? getInitials(name) : '?'}</span>
        )}
      </div>
      {status && (
        <span
          className={[
            'absolute bottom-0 right-0 rounded-full border-[rgba(var(--rf-surface),1)]',
            sizeConfig.status,
            statusColorMap[status],
            statusRingMap[status],
          ].join(' ')}
        />
      )}
    </div>
  );
};
