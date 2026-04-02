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
    <nav className="space-y-8 px-5 py-6">
      {sections.map((section) => (
        <div key={section.title}>
          <div className="mb-3 flex items-center gap-3 px-3">
            <span className="text-brand-600 font-serif text-xl">{section.index}</span>
            <h3 className="text-ink-500 text-[11px] font-semibold uppercase tracking-[0.18em]">
              {section.title}
            </h3>
          </div>
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
                        ? 'bg-brand-50 text-brand-800 font-medium shadow-[inset_0_0_0_1px_rgba(250,152,25,0.18)]'
                        : 'text-ink-600 hover:text-ink-900 hover:bg-white'
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
      <div className="rounded-[1.5rem] border border-[#dccfb9] bg-white p-4">
        <p className="text-ink-900 mb-2 font-serif text-lg">GitHub Pages</p>
        <p className="text-ink-600 mb-0 text-sm leading-6">
          This site is published from <code>apps/docs</code> and styled to mirror your editorial
          Figma site while keeping the RelayForge docs structure intact.
        </p>
      </div>
    </nav>
  );
}
