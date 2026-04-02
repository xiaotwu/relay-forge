import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import DocSidebar from './DocSidebar';

export default function DocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,1))]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center px-4 lg:px-6">
          <button
            className="mr-3 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
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
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20">
              RF
            </span>
            <span className="text-xl font-bold text-white">
              Relay<span className="text-brand-400">Forge</span>
            </span>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
              docs
            </span>
          </Link>
          <div className="flex-1" />
          <div className="mr-3 hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 md:block">
            Self-hosted chat, voice, and admin tooling
          </div>
          <a
            href="https://github.com/xiaotwu/relay-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
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
          className={`fixed top-16 z-40 h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <DocSidebar onNavClick={() => setSidebarOpen(false)} />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur md:p-8 lg:p-10">
            <div className="prose-dark mx-auto max-w-4xl">
              <div className="mb-8 rounded-2xl border border-cyan-400/15 bg-gradient-to-r from-cyan-400/10 via-sky-400/5 to-emerald-400/10 px-4 py-3 text-sm text-slate-300">
                RelayForge documentation is kept in sync with the monorepo layout under{' '}
                <code>apps/</code>, <code>services/</code>, <code>packages/</code>, and{' '}
                <code>infra/</code>.
              </div>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
