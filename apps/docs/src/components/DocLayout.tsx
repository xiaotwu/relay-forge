import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import DocSidebar from './DocSidebar';

export default function DocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="text-ink-900 relative flex min-h-screen flex-col overflow-hidden bg-[#f7f3eb]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(250,152,25,0.12),transparent_38%),linear-gradient(180deg,rgba(248,242,232,0.96),rgba(247,243,235,1))]" />

      <header className="bg-[#f7f3eb]/88 sticky top-0 z-50 border-b border-[#d8ccb8] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 lg:px-8">
          <button
            className="text-ink-700 hover:text-ink-900 rounded-xl border border-[#d8ccb8] bg-white/80 p-2 transition hover:bg-white lg:hidden"
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
          <Link to="/" className="editorial-meta text-ink-700 hover:text-ink-900 no-underline">
            WE ARE RELAYFORGE
          </Link>
          <div className="flex-1" />
          <nav className="editorial-meta hidden items-center gap-5 md:flex">
            <Link to="/quick-start" className="hover:text-ink-900 no-underline">
              Launch stack
            </Link>
            <Link to="/deployment" className="hover:text-ink-900 no-underline">
              Deployment
            </Link>
            <Link to="/security" className="hover:text-ink-900 no-underline">
              Security
            </Link>
          </nav>
          <a
            href="https://github.com/xiaotwu/relay-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-meta text-ink-700 hover:text-ink-900 no-underline"
            aria-label="RelayForge on GitHub"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 gap-10 px-4 sm:px-6 lg:px-8">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`bg-[#f7f3eb]/96 fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-[18.5rem] overflow-y-auto border-r border-[#e0d4c3] px-2 backdrop-blur-xl transition-transform lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <DocSidebar onNavClick={() => setSidebarOpen(false)} />
        </aside>

        <main className="min-w-0 flex-1 py-8 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="editorial-meta mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#d8ccb8] pb-4">
              <span>RelayForge documentation</span>
              <span>apps / services / packages / infra</span>
            </div>

            <div className="editorial-shell overflow-hidden">
              <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="border-b border-[#e6dbc9] p-6 md:p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <div className="prose-dark mx-auto max-w-4xl">
                    <div className="text-ink-700 mb-8 rounded-[1.5rem] border border-[#dccfb9] bg-white px-4 py-3 text-sm shadow-[0_10px_30px_rgba(30,61,89,0.06)]">
                      RelayForge documentation stays aligned with the live monorepo structure and
                      the simplified self-hosting flow under <code>infra/</code>.
                    </div>
                    <Outlet />
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-8 bg-[linear-gradient(180deg,#f8f4ec,#f3ecdf)] p-6">
                  <div>
                    <p className="editorial-meta mb-3">Inside this edition</p>
                    <p className="text-ink-900 mb-4 font-serif text-2xl">Operator notes</p>
                    <p className="text-ink-600 mb-0 text-sm leading-7">
                      Editorial docs shell adapted from the Figma template, with RelayForge-specific
                      guidance for deployment, security, and contribution workflows.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/quick-start"
                      className="text-ink-800 hover:text-brand-700 block rounded-[1rem] border border-[#dccfb9] bg-white px-4 py-3 text-sm no-underline transition hover:border-[#c9ab81]"
                    >
                      Quick start checklist
                    </Link>
                    <Link
                      to="/deployment"
                      className="text-ink-800 hover:text-brand-700 block rounded-[1rem] border border-[#dccfb9] bg-white px-4 py-3 text-sm no-underline transition hover:border-[#c9ab81]"
                    >
                      Self-host deployment
                    </Link>
                    <Link
                      to="/contributing"
                      className="text-ink-800 hover:text-brand-700 block rounded-[1rem] border border-[#dccfb9] bg-white px-4 py-3 text-sm no-underline transition hover:border-[#c9ab81]"
                    >
                      Contribution workflow
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="relative z-10 px-4 pb-14 pt-20 text-sm sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] border-t border-[#cbc1b4] pt-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_repeat(4,1fr)]">
            <div>
              <div className="text-ink-900 mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8ccb8] bg-white font-serif text-lg">
                RF
              </div>
              <p className="text-ink-600 mb-0 max-w-[14rem] text-sm leading-6">
                RelayForge docs, adapted from your editorial Figma template for the GitHub Pages
                site.
              </p>
            </div>
            <div className="editorial-meta text-ink-600 normal-case tracking-normal">
              <p className="mb-1">Repository:</p>
              <p className="mb-0">github.com/xiaotwu/relay-forge</p>
            </div>
            <div className="editorial-meta text-ink-600 normal-case tracking-normal">
              <p className="mb-1">Operators:</p>
              <p className="mb-0">Deployment and infrastructure guides</p>
            </div>
            <div className="editorial-meta text-ink-600 normal-case tracking-normal">
              <p className="mb-1">Contributors:</p>
              <p className="mb-0">Workflow, linting, tests, and docs upkeep</p>
            </div>
            <div className="editorial-meta text-ink-600 normal-case tracking-normal">
              <p className="mb-1">Rights:</p>
              <p className="mb-0">Open-source and self-hostable</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
