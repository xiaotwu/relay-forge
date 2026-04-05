import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import DocSidebar from './DocSidebar';
import DocSearch from './DocSearch';
import { DocIcon } from './DocIcons';
import { getDocMeta, getDocTitle, primaryLinks } from '../navigation';

export default function DocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getDocTitle(location.pathname);
  const pageMeta = getDocMeta(location.pathname);
  const wordmarkSrc = `${import.meta.env.BASE_URL}branding/relay-forge-wordmark.png`;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <a href="#main-content" className="doc-skip-link">
        Skip to main content
      </a>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(145,166,255,0.35),_transparent_48%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.92),_transparent_42%)]" />

      <header className="bg-stone-50/88 sticky top-0 z-40 border-b border-stone-200/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1560px] items-center gap-4 px-4 py-3 lg:px-8">
          <button
            className="doc-icon-button lg:hidden"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <DocIcon name="menu" className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </button>

          <Link to="/" className="no-underline">
            <div className="doc-brand-card">
              <span className="doc-brand-mark" aria-hidden="true">
                <DocIcon name="book" className="h-4 w-4" />
              </span>
              <img src={wordmarkSrc} alt="RelayForge" className="doc-brand-wordmark" />
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {primaryLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                title={item.label}
                aria-label={item.label}
                className={({ isActive }) =>
                  `doc-toolbar-link ${isActive ? 'doc-toolbar-link-active' : ''}`
                }
              >
                <DocIcon name={item.icon} className="h-4 w-4" />
                <span className="sr-only 2xl:not-sr-only 2xl:text-sm 2xl:font-medium">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="hidden min-w-0 flex-1 lg:block">
            <DocSearch />
          </div>

          <div className="flex-1 lg:hidden" />

          <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white/85 px-3 py-2 text-sm text-stone-500 shadow-sm xl:inline-flex">
            {pageMeta ? <DocIcon name={pageMeta.icon} className="h-4 w-4 text-stone-700" /> : null}
            <span className="font-semibold text-stone-900">{pageTitle}</span>
          </div>

          <a
            href="https://github.com/xiaotwu/relay-forge"
            target="_blank"
            rel="noreferrer"
            className="doc-toolbar-link hidden md:inline-flex"
            title="Open the relay-forge repository"
            aria-label="Open the relay-forge repository"
          >
            <DocIcon name="github" className="h-4 w-4" />
            <span className="hidden xl:inline">Client</span>
          </a>
          <a
            href="https://github.com/xiaotwu/relay-forge-server"
            target="_blank"
            rel="noreferrer"
            className="doc-toolbar-link hidden md:inline-flex"
            title="Open the relay-forge-server repository"
            aria-label="Open the relay-forge-server repository"
          >
            <DocIcon name="server" className="h-4 w-4" />
            <span className="hidden xl:inline">Server</span>
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
          <div className="mb-5 lg:hidden">
            <DocSearch />
          </div>
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
