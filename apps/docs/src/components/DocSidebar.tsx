import { NavLink } from 'react-router-dom';

const sections = [
  {
    label: 'Client',
    items: [
      { label: 'Overview', to: '/' },
      { label: 'Repo Boundaries', to: '/architecture' },
      { label: 'Quick Start', to: '/quick-start' },
      { label: 'Local Development', to: '/local-dev' },
      { label: 'Endpoint Config', to: '/config' },
      { label: 'Packaging', to: '/deployment' },
      { label: 'Contributing', to: '/contributing' },
      { label: 'Security', to: '/security' },
      { label: 'FAQ', to: '/faq' }
    ]
  },
  {
    label: 'Server',
    items: [
      { label: 'Backend Overview', to: '/server' },
      { label: 'Architecture', to: '/server/architecture' },
      { label: 'Operations', to: '/server/operations' },
      { label: 'Security Model', to: '/server/security' }
    ]
  }
];

export default function DocSidebar({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <nav className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          RelayForge Handbook
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          One docs site for the client applications, backend services, deployment notes, and repo
          boundaries.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.label} className="space-y-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {section.label}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => (
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
        </div>
      ))}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        The client repo publishes this site. The backend source of truth lives in{' '}
        <code>relay-forge-server</code>.
      </div>
    </nav>
  );
}
