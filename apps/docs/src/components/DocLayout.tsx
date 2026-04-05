import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import DocSidebar from './DocSidebar';
import { getDocTitle, primaryLinks } from '../navigation';

export default function DocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getDocTitle(location.pathname);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <a href="#main-content" className="doc-skip-link">
        Skip to main content
      </a>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(145,166,255,0.35),_transparent_48%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.92),_transparent_42%)]" />

      <header className="bg-stone-50/88 sticky top-0 z-40 border-b border-stone-200/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1560px] items-center gap-4 px-4 py-3 lg:px-8">
          <button
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium shadow-sm lg:hidden"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            Menu
          </button>

          <Link to="/" className="no-underline">
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-2 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                RelayForge
              </p>
              <p className="text-sm font-semibold text-stone-950">Handbook</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {primaryLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium no-underline transition ${
                    isActive
                      ? 'bg-stone-950 text-stone-50'
                      : 'text-stone-700 hover:bg-white hover:text-stone-950'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden flex-1 xl:block">
            <div className="mx-auto max-w-md rounded-full border border-stone-200 bg-white/90 px-4 py-2 text-sm text-stone-500 shadow-sm">
              Search by sidebar section, repo path, or service name
            </div>
          </div>

          <div className="flex-1 lg:hidden" />

          <div className="hidden text-sm text-stone-500 xl:block">
            <span className="font-semibold text-stone-900">{pageTitle}</span>
          </div>

          <a
            href="https://github.com/xiaotwu/relay-forge"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 no-underline shadow-sm transition hover:border-stone-300 hover:text-stone-950 md:inline-flex"
          >
            Client Repo
          </a>
          <a
            href="https://github.com/xiaotwu/relay-forge-server"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 no-underline shadow-sm transition hover:border-stone-300 hover:text-stone-950 md:inline-flex"
          >
            Server Repo
          </a>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-[1560px] gap-8 px-4 pb-14 pt-6 lg:gap-10 lg:px-8">
        {sidebarOpen && (
          <button
            className="fixed inset-0 z-30 bg-stone-950/25 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <aside
          className={`fixed left-0 top-[72px] z-40 h-[calc(100vh-72px)] w-80 overflow-y-auto border-r border-stone-200 bg-stone-100/95 p-5 transition-transform lg:static lg:h-auto lg:w-[320px] lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:p-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <DocSidebar onNavClick={() => setSidebarOpen(false)} />
        </aside>

        <main id="main-content" className="min-w-0 flex-1">
          <div className="doc-page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
