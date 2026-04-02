import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
}

export interface DropdownDivider {
  type: 'divider';
}

export type DropdownEntry = DropdownItem | DropdownDivider;

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownEntry[];
  align?: 'left' | 'right';
  className?: string;
}

function isDivider(entry: DropdownEntry): entry is DropdownDivider {
  return 'type' in entry && entry.type === 'divider';
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const actionableItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !isDivider(item) && !(item as DropdownItem).disabled);

  const close = useCallback(() => {
    setOpen(false);
    setFocusIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        setFocusIndex(0);
      }
      return;
    }

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
        if (focused && !isDivider(focused) && !focused.disabled) {
          focused.onClick();
          close();
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        close();
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={['relative inline-block', className].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
    >
      <div
        onClick={() => {
          setOpen(!open);
          if (!open) setFocusIndex(-1);
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </div>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className={[
            'absolute z-[1000] mt-1 min-w-[180px] rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          ].join(' ')}
        >
          {items.map((entry, index) => {
            if (isDivider(entry)) {
              return (
                <div key={`divider-${index}`} className="my-1 h-px bg-zinc-700" role="separator" />
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
        </div>
      )}
    </div>
  );
};
