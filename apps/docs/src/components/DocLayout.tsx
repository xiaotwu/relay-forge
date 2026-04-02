import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import DocSidebar from './DocSidebar';

export default function DocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="text-ink-900 relative flex min-h-screen flex-col overflow-hidden bg-[#f7f3eb]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(250,152,25,0.18),transparent_42%),radial-gradient(circle_at_20%_10%,rgba(30,61,89,0.10),transparent_30%),linear-gradient(180deg,rgba(248,242,232,0.95),rgba(247,243,235,1))]" />

      <header className="sticky top-0 z-50 border-b border-[#d8ccb8] bg-[#f7f3eb]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center px-4 lg:px-6">
          <button
            className="text-ink-700 hover:bg-brand-50 hover:text-ink-900 mr-3 rounded-xl border border-[#d8ccb8] bg-white p-2 transition lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-3">
            <span className="from-brand-500 to-brand-700 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br font-black text-white shadow-[0_12px_24px_rgba(250,152,25,0.28)]">
              RF
            </span>
            <span className="text-ink-900 text-xl font-bold">
              Relay<span className="text-brand-600">Forge</span>
            </span>
            <span className="section-chip">docs</span>
          </Link>
          <div className="flex-1" />
          <div className="text-ink-600 mr-3 hidden rounded-full border border-[#d8ccb8] bg-white px-3 py-1 text-xs font-medium md:block">
            GitHub Pages template edition
          </div>
          <a
            href="https://github.com/xiaotwu/relay-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-700 hover:bg-brand-50 hover:text-ink-900 rounded-xl border border-[#d8ccb8] bg-white p-2 transition"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed top-16 z-40 h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-[#d8ccb8] bg-[#f8f4ec]/95 backdrop-blur-xl transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <DocSidebar onNavClick={() => setSidebarOpen(false)} />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="editorial-shell mx-auto max-w-5xl p-6 md:p-8 lg:p-10">
            <div className="prose-dark mx-auto max-w-4xl">
              <div className="text-ink-700 mb-8 rounded-[1.5rem] border border-[#dccfb9] bg-white px-4 py-3 text-sm shadow-[0_10px_30px_rgba(30,61,89,0.06)]">
                RelayForge documentation is kept in sync with the monorepo layout under{' '}
                <code>apps/</code>, <code>services/</code>, <code>packages/</code>, and{' '}
                <code>infra/</code>.
              </div>
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <footer className="text-ink-600 relative z-10 border-t border-[#d8ccb8] px-4 py-8 text-sm">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="mb-0">
            RelayForge GitHub Pages, adapted from your Figma site&apos;s editorial template.
          </p>
          <div className="flex gap-5">
            <Link to="/quick-start" className="hover:text-brand-700">
              Quick Start
            </Link>
            <Link to="/deployment" className="hover:text-brand-700">
              Deployment
            </Link>
            <a
              href="https://github.com/xiaotwu/relay-forge"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-700"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
