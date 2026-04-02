import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Home', to: '/' },
      { label: 'Features', to: '/features' },
      { label: 'Architecture', to: '/architecture' },
    ],
  },
  {
    title: 'Getting Started',
    items: [
      { label: 'Quick Start', to: '/quick-start' },
      { label: 'Local Development', to: '/local-dev' },
      { label: 'Configuration', to: '/config' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { label: 'Deploy Guide', to: '/deployment' },
      { label: 'Multi-Cloud', to: '/multi-cloud' },
      { label: 'Monitoring', to: '/monitoring' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { label: 'Permissions & RBAC', to: '/permissions' },
      { label: 'End-to-End Encryption', to: '/e2ee' },
      { label: 'Voice & Video (LiveKit)', to: '/livekit' },
      { label: 'Object Storage', to: '/storage' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Admin Guide', to: '/admin' },
      { label: 'Security', to: '/security' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Contributing', to: '/contributing' },
      { label: 'Changelog', to: '/changelog' },
      { label: 'License', to: '/license' },
    ],
  },
];

export default function DocSidebar({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <nav className="space-y-8 px-4 py-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {section.title}
          </h3>
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
                        ? 'bg-gradient-to-r from-cyan-400/15 to-emerald-400/10 font-medium text-cyan-200 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.14)]'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
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
    </nav>
  );
}
