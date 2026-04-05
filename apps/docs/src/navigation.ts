export interface DocNavItem {
  label: string;
  to: string;
  blurb?: string;
}

export interface DocNavSection {
  label: string;
  items: DocNavItem[];
}

export const docsSections: DocNavSection[] = [
  {
    label: 'Getting started',
    items: [
      { label: 'Overview', to: '/', blurb: 'Unified handbook and repo policy.' },
      {
        label: 'Quick start',
        to: '/quick-start',
        blurb: 'Boot the client against local or hosted backends.',
      },
      {
        label: 'Client applications',
        to: '/local-dev',
        blurb: 'Day-to-day workflows for web, admin, desktop, and docs.',
      },
      {
        label: 'Endpoint contract',
        to: '/config',
        blurb: 'The runtime boundary between the repos.',
      },
    ],
  },
  {
    label: 'Client platform',
    items: [
      {
        label: 'Repository topology',
        to: '/architecture',
        blurb: 'How relay-forge and relay-forge-server split responsibilities.',
      },
      { label: 'Client surfaces', to: '/client-apps', blurb: 'What each user-facing app is for.' },
      {
        label: 'Shared packages',
        to: '/shared-packages',
        blurb: 'SDK, UI, config, crypto, and shared types.',
      },
      {
        label: 'Security and license',
        to: '/security',
        blurb: 'Security expectations and the Apache-2.0 decision.',
      },
    ],
  },
  {
    label: 'Backend platform',
    items: [
      {
        label: 'Server overview',
        to: '/server',
        blurb: 'The runtime model and supporting infrastructure.',
      },
      {
        label: 'Services and data flow',
        to: '/server/architecture',
        blurb: 'API, realtime, media, worker, and storage boundaries.',
      },
      {
        label: 'Operations and deployment',
        to: '/server/operations',
        blurb: 'Docker, scaling, observability, and release expectations.',
      },
      {
        label: 'Security model',
        to: '/server/security',
        blurb: 'Threat model, trust boundaries, and intentional tradeoffs.',
      },
    ],
  },
  {
    label: 'Delivery',
    items: [
      {
        label: 'Build and release',
        to: '/deployment',
        blurb: 'GitHub Pages, release assets, and GHCR publishing.',
      },
    ],
  },
  {
    label: 'Project',
    items: [
      {
        label: 'Contributing',
        to: '/contributing',
        blurb: 'Standard branch, docs, and PR expectations.',
      },
      { label: 'FAQ', to: '/faq', blurb: 'Answers for common repo and deployment questions.' },
      {
        label: 'References',
        to: '/references',
        blurb: 'Primary technologies and documentation links.',
      },
    ],
  },
];

export const primaryLinks: DocNavItem[] = [
  { label: 'Overview', to: '/' },
  { label: 'Client', to: '/client-apps' },
  { label: 'Backend', to: '/server' },
  { label: 'Delivery', to: '/deployment' },
];

export function getDocTitle(pathname: string): string {
  const normalized = pathname === '' ? '/' : pathname;
  for (const section of docsSections) {
    for (const item of section.items) {
      if (item.to === normalized) {
        return item.label;
      }
    }
  }

  return 'RelayForge Handbook';
}
