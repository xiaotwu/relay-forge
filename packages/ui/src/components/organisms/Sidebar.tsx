import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface SidebarProps {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  side?: 'left' | 'right';
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  defaultWidth = 260,
  minWidth = 200,
  maxWidth = 420,
  resizable = true,
  side = 'left',
  className = '',
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const isResizing = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      if (!resizable) return;
      e.preventDefault();
      isResizing.current = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [resizable],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !sidebarRef.current) return;

      const rect = sidebarRef.current.getBoundingClientRect();
      let newWidth: number;

      if (side === 'left') {
        newWidth = e.clientX - rect.left;
      } else {
        newWidth = rect.right - e.clientX;
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minWidth, maxWidth, side]);

  return (
    <div
      ref={sidebarRef}
      className={[
        'relative h-full flex-shrink-0 overflow-hidden border-zinc-800 bg-zinc-900',
        side === 'left' ? 'border-r' : 'border-l',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width }}
    >
      <div className="h-full overflow-y-auto overflow-x-hidden">{children}</div>

      {resizable && (
        <div
          className={[
            'absolute bottom-0 top-0 z-10 w-1 cursor-col-resize',
            'transition-colors hover:bg-indigo-500/50 active:bg-indigo-500/70',
            side === 'left' ? 'right-0' : 'left-0',
          ].join(' ')}
          onMouseDown={startResize}
        />
      )}
    </div>
  );
};
