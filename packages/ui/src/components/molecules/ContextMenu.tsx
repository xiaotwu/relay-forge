import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
}

export interface ContextMenuDivider {
  type: 'divider';
}

export type ContextMenuEntry = ContextMenuItem | ContextMenuDivider;

export interface ContextMenuProps {
  items: ContextMenuEntry[];
  children: React.ReactNode;
  disabled?: boolean;
}

function isDivider(entry: ContextMenuEntry): entry is ContextMenuDivider {
  return 'type' in entry && entry.type === 'divider';
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ items, children, disabled = false }) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [focusIndex, setFocusIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setPosition(null);
    setFocusIndex(-1);
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      // Position the menu, keeping it within viewport
      const x = Math.min(e.clientX, window.innerWidth - 200);
      const y = Math.min(e.clientY, window.innerHeight - 300);
      setPosition({ x, y });
      setFocusIndex(-1);
    },
    [disabled],
  );

  useEffect(() => {
    if (!position) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleScroll = () => close();
    const handleResize = () => close();

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [position, close]);

  const actionableItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !isDivider(item) && !(item as ContextMenuItem).disabled);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const currentPos = actionableItems.findIndex((a) => a.index === focusIndex);
          const next = currentPos < actionableItems.length - 1 ? currentPos + 1 : 0;
          setFocusIndex(actionableItems[next].index);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const currentPos = actionableItems.findIndex((a) => a.index === focusIndex);
          const prev = currentPos > 0 ? currentPos - 1 : actionableItems.length - 1;
          setFocusIndex(actionableItems[prev].index);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          const focused = items[focusIndex];
          if (focused && !isDivider(focused) && !(focused as ContextMenuItem).disabled) {
            (focused as ContextMenuItem).onClick();
            close();
          }
          break;
        }
        case 'Escape':
          e.preventDefault();
          close();
          break;
      }
    },
    [focusIndex, items, actionableItems, close],
  );

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      {position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="fixed z-[1090] min-w-[180px] rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-xl"
            style={{ left: position.x, top: position.y }}
          >
            {items.map((entry, index) => {
              if (isDivider(entry)) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="my-1 h-px bg-zinc-700"
                    role="separator"
                  />
                );
              }

              const item = entry;
              const isFocused = focusIndex === index;

              return (
                <div
                  key={item.id}
                  role="menuitem"
                  tabIndex={-1}
                  className={[
                    'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors',
                    item.disabled
                      ? 'cursor-not-allowed opacity-40'
                      : item.danger
                        ? 'text-red-400 hover:bg-red-900/30'
                        : 'text-zinc-300 hover:bg-zinc-800',
                    isFocused && !item.disabled
                      ? item.danger
                        ? 'bg-red-900/30'
                        : 'bg-zinc-800'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      close();
                    }
                  }}
                  onMouseEnter={() => setFocusIndex(index)}
                >
                  {item.icon && <span className="h-4 w-4 flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
};
