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
        'ambient-shell flex h-screen w-screen overflow-hidden',
        'bg-base text-text-primary',
        'font-sans antialiased',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left sidebar */}
      {sidebar}

      {/* Main area */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.08),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(74,222,128,0.10),_transparent_28%)]" />
        {/* Header */}
        {header && (
          <div className="bg-white/88 relative flex h-16 flex-shrink-0 items-center border-b border-black/5 px-5 backdrop-blur-xl">
            {header}
          </div>
        )}

        {/* Content + Right panel */}
        <div className="relative flex min-h-0 flex-1">
          {/* Main content */}
          <main className="bg-white/82 flex min-w-0 flex-1 flex-col backdrop-blur-xl">
            {children}
          </main>

          {/* Optional right panel */}
          {rightPanel && (
            <aside className="w-60 flex-shrink-0 overflow-y-auto border-l border-black/5 bg-[#f7faf8]/95 backdrop-blur-xl">
              {rightPanel}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
