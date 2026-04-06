import type { DocIconName } from './components/DocIcons';

export interface DocNavItem {
  label: string;
  to: string;
  blurb?: string;
  icon: DocIconName;
  keywords?: string[];
}

export interface DocNavSection {
  label: string;
  icon: DocIconName;
  items: DocNavItem[];
}

export interface DocSearchEntry extends DocNavItem {
  sectionLabel: string;
  sectionIcon: DocIconName;
  searchText: string;
}

export const docsSections: DocNavSection[] = [
  {
    label: 'Getting started',
    icon: 'spark',
    items: [
      {
        label: 'Overview',
        to: '/',
        blurb: 'Unified handbook and repo policy.',
        icon: 'home',
        keywords: ['handbook', 'home', 'documentation', 'policy', 'pages'],
      },
      {
        label: 'Quick start',
        to: '/quick-start',
        blurb: 'Boot the client against local or hosted backends.',
        icon: 'terminal',
        keywords: ['setup', 'install', 'run', 'start', 'onboarding'],
      },
      {
        label: 'Client applications',
        to: '/local-dev',
        blurb: 'Day-to-day workflows for web, admin, desktop, and docs.',
        icon: 'window',
        keywords: ['local', 'development', 'apps', 'web', 'desktop', 'admin', 'docs'],
      },
      {
        label: 'Endpoint contract',
        to: '/config',
        blurb: 'The runtime boundary between the repos.',
        icon: 'plug',
        keywords: ['config', 'environment', 'api', 'base url', 'contract'],
      },
    ],
  },
  {
    label: 'Client platform',
    icon: 'grid',
    items: [
      {
        label: 'Repository topology',
        to: '/architecture',
        blurb: 'How relay-forge and relay-forge-server split responsibilities.',
        icon: 'layers',
        keywords: ['repo map', 'monorepo', 'architecture', 'directories', 'layout'],
      },
      {
        label: 'Client surfaces',
        to: '/client-apps',
        blurb: 'What each user-facing app is for.',
        icon: 'window',
        keywords: ['web', 'admin', 'desktop', 'docs', 'surfaces', 'applications'],
      },
      {
        label: 'Shared packages',
        to: '/shared-packages',
        blurb: 'SDK, UI, config, crypto, and shared types.',
        icon: 'box',
        keywords: ['packages', 'sdk', 'ui', 'crypto', 'types', 'shared'],
      },
      {
        label: 'Security and license',
        to: '/security',
        blurb: 'Security expectations and the Apache-2.0 decision.',
        icon: 'shield',
        keywords: ['license', 'apache', 'security', 'reporting', 'policy'],
      },
    ],
  },
  {
    label: 'Backend platform',
    icon: 'server',
    items: [
      {
        label: 'Server overview',
        to: '/server',
        blurb: 'The runtime model and supporting infrastructure.',
        icon: 'server',
        keywords: ['backend', 'api', 'realtime', 'media', 'worker', 'runtime'],
      },
      {
        label: 'Services and data flow',
        to: '/server/architecture',
        blurb: 'API, realtime, media, worker, and storage boundaries.',
        icon: 'network',
        keywords: ['flow', 'services', 'data', 'storage', 'ownership', 'contracts'],
      },
      {
        label: 'Operations and deployment',
        to: '/server/operations',
        blurb: 'Docker, scaling, observability, and release expectations.',
        icon: 'cloud',
        keywords: ['operations', 'docker', 'observability', 'deploy', 'production', 'scaling'],
      },
      {
        label: 'Security model',
        to: '/server/security',
        blurb: 'Threat model, trust boundaries, and intentional tradeoffs.',
        icon: 'lock',
        keywords: ['threat model', 'boundaries', 'tradeoffs', 'moderation', 'audit'],
      },
    ],
  },
  {
    label: 'Delivery',
    icon: 'rocket',
    items: [
      {
        label: 'Build and release',
        to: '/deployment',
        blurb: 'GitHub Pages, release assets, and GHCR publishing.',
        icon: 'rocket',
        keywords: ['ci', 'cicd', 'release', 'github actions', 'pages', 'ghcr'],
      },
    ],
  },
  {
    label: 'Project',
    icon: 'compass',
    items: [
      {
        label: 'Contributing',
        to: '/contributing',
        blurb: 'Standard branch, docs, and PR expectations.',
        icon: 'git-branch',
        keywords: ['pr', 'branching', 'review', 'guidelines', 'contribution'],
      },
      {
        label: 'FAQ',
        to: '/faq',
        blurb: 'Answers for common repo and deployment questions.',
        icon: 'help',
        keywords: ['questions', 'answers', 'help', 'common'],
      },
      {
        label: 'References',
        to: '/references',
        blurb: 'Primary technologies and documentation links.',
        icon: 'link',
        keywords: ['references', 'docs', 'links', 'technologies', 'sources'],
      },
    ],
  },
];

export const primaryLinks: DocNavItem[] = [
  { label: 'Overview', to: '/', icon: 'home' },
  { label: 'Client', to: '/client-apps', icon: 'grid' },
  { label: 'Backend', to: '/server', icon: 'server' },
  { label: 'Delivery', to: '/deployment', icon: 'rocket' },
];

export const docSearchEntries: DocSearchEntry[] = docsSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionLabel: section.label,
    sectionIcon: section.icon,
    searchText: [section.label, item.label, item.to, item.blurb ?? '', ...(item.keywords ?? [])]
      .join(' ')
      .toLowerCase(),
  })),
);

export function getDocMeta(pathname: string): DocSearchEntry | null {
  const normalized = pathname === '' ? '/' : pathname;
  return docSearchEntries.find((item) => item.to === normalized) ?? null;
}

export function getDocTitle(pathname: string): string {
  return getDocMeta(pathname)?.label ?? 'RelayForge Handbook';
}
