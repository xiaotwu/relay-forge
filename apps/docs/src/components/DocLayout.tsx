import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import DocSidebar from './DocSidebar';

export default function DocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm lg:hidden"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            Menu
          </button>
          <Link to="/" className="text-sm font-semibold tracking-wide text-slate-900 no-underline">
            RelayForge Docs
          </Link>
          <div className="flex-1" />
          <a
            href="https://github.com/xiaotwu/relay-forge"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-600 no-underline hover:text-slate-900"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {sidebarOpen && (
          <button
            className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <aside
          className={`fixed left-0 top-[57px] z-40 h-[calc(100vh-57px)] w-72 overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:h-auto lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:p-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <DocSidebar onNavClick={() => setSidebarOpen(false)} />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <div className="prose-slim">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
