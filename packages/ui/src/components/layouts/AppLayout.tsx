import React from 'react';

export interface AppLayoutProps {
  /** Left sidebar (guild list, channel list). */
  sidebar: React.ReactNode;
  /** Main content area (message list, input). */
  children: React.ReactNode;
  /** Optional right panel (member list, thread view). */
  rightPanel?: React.ReactNode;
  /** Optional top bar / header above main content. */
  header?: React.ReactNode;
  /** Additional className on the root container. */
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  sidebar,
  children,
  rightPanel,
  header,
  className = '',
}) => {
  return (
    <div
      className={[
        'flex h-screen w-screen overflow-hidden',
        'bg-[#0f0f12] text-zinc-100',
        'font-sans antialiased',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left sidebar */}
      {sidebar}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        {header && (
          <div className="flex h-12 flex-shrink-0 items-center border-b border-zinc-800 bg-[#16161d] px-4">
            {header}
          </div>
        )}

        {/* Content + Right panel */}
        <div className="flex min-h-0 flex-1">
          {/* Main content */}
          <main className="flex min-w-0 flex-1 flex-col bg-[#16161d]">{children}</main>

          {/* Optional right panel */}
          {rightPanel && (
            <aside className="w-60 flex-shrink-0 overflow-y-auto border-l border-zinc-800 bg-[#0f0f12]">
              {rightPanel}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
