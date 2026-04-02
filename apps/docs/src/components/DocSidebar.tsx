import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Overview', to: '/' },
  { label: 'Repo Boundaries', to: '/architecture' },
  { label: 'Quick Start', to: '/quick-start' },
  { label: 'Local Development', to: '/local-dev' },
  { label: 'Endpoint Config', to: '/config' },
  { label: 'Packaging', to: '/deployment' },
  { label: 'Contributing', to: '/contributing' },
  { label: 'Security', to: '/security' },
  { label: 'FAQ', to: '/faq' }
];

export default function DocSidebar({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <nav className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          RelayForge Clients
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Client setup, packaging, and documentation for the web, admin, and desktop applications.
        </p>
      </div>

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              onClick={onNavClick}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Backend services are staged in <code>new-project/</code> and intended to move into a
        separate repository.
      </div>
    </nav>
  );
}
