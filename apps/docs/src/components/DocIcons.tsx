export type DocIconName =
  | 'arrow-right'
  | 'book'
  | 'box'
  | 'cloud'
  | 'compass'
  | 'external'
  | 'git-branch'
  | 'github'
  | 'grid'
  | 'help'
  | 'home'
  | 'layers'
  | 'link'
  | 'lock'
  | 'menu'
  | 'network'
  | 'plug'
  | 'rocket'
  | 'search'
  | 'server'
  | 'shield'
  | 'spark'
  | 'terminal'
  | 'window';

interface DocIconProps {
  name: DocIconName;
  className?: string;
}

export function DocIcon({ name, className = 'h-4 w-4' }: DocIconProps) {
  const sharedProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    'aria-hidden': true,
    focusable: false,
  };

  switch (name) {
    case 'arrow-right':
      return (
        <svg {...sharedProps}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case 'book':
      return (
        <svg {...sharedProps}>
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v18H7.5A2.5 2.5 0 0 0 5 23" />
          <path d="M5 5.5V21" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
        </svg>
      );
    case 'box':
      return (
        <svg {...sharedProps}>
          <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
          <path d="M12 21V11.7" />
          <path d="M21 7.5 12 12 3 7.5" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...sharedProps}>
          <path d="M7 18a4 4 0 0 1-.6-8A5.8 5.8 0 0 1 17.4 8 3.8 3.8 0 1 1 18 18Z" />
          <path d="M12 10v8" />
          <path d="m9.5 15 2.5 3 2.5-3" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m14.8 9.2-4 1.8-1.8 4 4-1.8 1.8-4Z" />
        </svg>
      );
    case 'external':
      return (
        <svg {...sharedProps}>
          <path d="M14 5h5v5" />
          <path d="M10 14 19 5" />
          <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        </svg>
      );
    case 'git-branch':
      return (
        <svg {...sharedProps}>
          <path d="M6 3v12" />
          <path d="M6 9h9a3 3 0 0 0 3-3V3" />
          <path d="M15 15h3a3 3 0 0 1 3 3v3" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
        </svg>
      );
    case 'github':
      return (
        <svg {...sharedProps}>
          <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.61-.19.61-.43v-1.5c-2.49.54-3.02-1.06-3.02-1.06-.41-1.03-1-1.31-1-1.31-.82-.56.06-.55.06-.55.91.06 1.38.92 1.38.92.8 1.38 2.1.98 2.62.75.08-.58.31-.98.56-1.2-1.99-.22-4.09-.99-4.09-4.44 0-.98.35-1.78.92-2.41-.09-.22-.4-1.13.09-2.35 0 0 .76-.24 2.48.92A8.7 8.7 0 0 1 12 7.62c.77 0 1.55.1 2.27.3 1.72-1.16 2.47-.92 2.47-.92.5 1.22.19 2.13.1 2.35.57.63.91 1.43.91 2.41 0 3.46-2.11 4.21-4.12 4.43.32.28.61.83.61 1.68v2.24c0 .24.16.52.62.43A9 9 0 0 0 12 3Z" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...sharedProps}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'help':
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.2a2.5 2.5 0 1 1 4.2 2c-.8.65-1.7 1.2-1.7 2.3" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'home':
      return (
        <svg {...sharedProps}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9.5V20h14V9.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );
    case 'layers':
      return (
        <svg {...sharedProps}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </svg>
      );
    case 'link':
      return (
        <svg {...sharedProps}>
          <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
          <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...sharedProps}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...sharedProps}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
    case 'network':
      return (
        <svg {...sharedProps}>
          <rect x="3" y="4" width="7" height="6" rx="1.5" />
          <rect x="14" y="4" width="7" height="6" rx="1.5" />
          <rect x="8.5" y="14" width="7" height="6" rx="1.5" />
          <path d="M10 7h4" />
          <path d="M7 10v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
        </svg>
      );
    case 'plug':
      return (
        <svg {...sharedProps}>
          <path d="M9 7V3" />
          <path d="M15 7V3" />
          <path d="M8 7h8v3a4 4 0 0 1-4 4 4 4 0 0 1-4-4Z" />
          <path d="M12 14v7" />
        </svg>
      );
    case 'rocket':
      return (
        <svg {...sharedProps}>
          <path d="M5 19c2.5-3 4.5-4.5 7.5-5.5 1.7-.6 3.3-2.3 4.3-4.3 1-2 .8-4.2.8-4.2s-2.2-.2-4.2.8c-2 1-3.7 2.6-4.3 4.3C8 13 6.5 15 3.5 17.5" />
          <path d="M9 15 5 19" />
          <path d="m10 10 4 4" />
          <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'search':
      return (
        <svg {...sharedProps}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.2-4.2" />
        </svg>
      );
    case 'server':
      return (
        <svg {...sharedProps}>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" />
          <path d="M8 7h.01" />
          <path d="M8 17h.01" />
          <path d="M12 7h6" />
          <path d="M12 17h6" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...sharedProps}>
          <path d="M12 3s5 2 7 3v5c0 4.3-2.7 7.8-7 10-4.3-2.2-7-5.7-7-10V6c2-1 7-3 7-3Z" />
          <path d="m9.5 12 1.8 1.8 3.2-3.8" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...sharedProps}>
          <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
          <path d="m5 18 .8 2.2L8 21l-2.2.8L5 24l-.8-2.2L2 21l2.2-.8L5 18Z" />
        </svg>
      );
    case 'terminal':
      return (
        <svg {...sharedProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m7 9 3 3-3 3" />
          <path d="M13 15h4" />
        </svg>
      );
    case 'window':
      return (
        <svg {...sharedProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <path d="M7 7h.01" />
          <path d="M10 7h.01" />
        </svg>
      );
    default:
      return null;
  }
}
