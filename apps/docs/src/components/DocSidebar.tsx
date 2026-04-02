import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
}

interface NavSection {
  index: string;
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    index: '01',
    title: 'Overview',
    items: [
      { label: 'Home', to: '/' },
      { label: 'Features', to: '/features' },
      { label: 'Architecture', to: '/architecture' },
    ],
  },
  {
    index: '02',
    title: 'Getting Started',
    items: [
      { label: 'Quick Start', to: '/quick-start' },
      { label: 'Local Development', to: '/local-dev' },
      { label: 'Configuration', to: '/config' },
    ],
  },
  {
    index: '03',
    title: 'Deployment',
    items: [
      { label: 'Deploy Guide', to: '/deployment' },
      { label: 'Multi-Cloud', to: '/multi-cloud' },
      { label: 'Monitoring', to: '/monitoring' },
    ],
  },
  {
    index: '04',
    title: 'Core Concepts',
    items: [
      { label: 'Permissions & RBAC', to: '/permissions' },
      { label: 'End-to-End Encryption', to: '/e2ee' },
      { label: 'Voice & Video (LiveKit)', to: '/livekit' },
      { label: 'Object Storage', to: '/storage' },
    ],
  },
  {
    index: '05',
    title: 'Operations',
    items: [
      { label: 'Admin Guide', to: '/admin' },
      { label: 'Security', to: '/security' },
    ],
  },
  {
    index: '06',
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
    <nav className="space-y-8 px-4 py-8">
      <div className="rounded-[1.5rem] border border-[#dccfb9] bg-white/80 p-4 shadow-[0_14px_32px_rgba(30,61,89,0.04)]">
        <p className="editorial-meta mb-2">GitHub Pages</p>
        <p className="text-ink-900 mb-2 font-serif text-xl">RelayForge handbook</p>
        <p className="text-ink-600 mb-0 text-sm leading-6">
          A guided table of contents for operators, contributors, and self-hosters.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <div className="mb-3 flex items-center gap-3 px-3">
            <span className="font-serif text-xl text-[#b58a59]">{section.index}</span>
            <h3 className="editorial-meta">{section.title}</h3>
          </div>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    `block rounded-[1rem] px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'text-ink-900 bg-white font-medium shadow-[inset_0_0_0_1px_rgba(181,138,89,0.22),0_12px_24px_rgba(30,61,89,0.05)]'
                        : 'text-ink-600 hover:text-ink-900 hover:bg-white/85'
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

      <div className="rounded-[1.5rem] border border-[#dccfb9] bg-[#f5eee3] p-4">
        <p className="editorial-meta mb-2">Source</p>
        <p className="text-ink-700 mb-0 text-sm leading-6">
          Published from <code>apps/docs</code> and kept aligned with the monorepo&apos;s
          <code>infra/</code>, <code>services/</code>, and <code>apps/</code> structure.
        </p>
      </div>
    </nav>
  );
}
