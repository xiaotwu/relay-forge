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
    <nav className="space-y-6 px-4 py-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-400 font-medium'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
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
