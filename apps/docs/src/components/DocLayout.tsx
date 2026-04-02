import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import DocSidebar from './DocSidebar';

export default function DocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4 lg:px-6">
          <button
            className="mr-3 rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-200 lg:hidden"
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
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Relay<span className="text-brand-400">Forge</span>
            </span>
            <span className="bg-brand-600/20 text-brand-300 rounded px-2 py-0.5 text-xs font-medium">
              docs
            </span>
          </Link>
          <div className="flex-1" />
          <a
            href="https://github.com/your-org/relay-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-14 z-40 h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r border-gray-800 bg-gray-950 transition-transform lg:sticky lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <DocSidebar onNavClick={() => setSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-12 lg:py-10">
          <div className="prose-dark mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
