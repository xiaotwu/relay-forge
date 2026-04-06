export const colors = {
  primary: {
    50: '#eef0ff',
    100: '#dfe3ff',
    200: '#c5cbff',
    300: '#a7afff',
    400: '#8994ff',
    500: '#5865f2',
    600: '#4752c4',
    700: '#3c45a5',
    800: '#31377f',
    900: '#252a5a',
    950: '#171a35',
  },

  bg: {
    primary: '#1e1f22',
    secondary: '#232428',
    tertiary: '#2b2d31',
    elevated: '#313338',
    hover: '#3a3c43',
    active: '#404249',
    overlay: 'rgba(17, 18, 20, 0.56)',
  },

  text: {
    primary: '#f2f3f5',
    secondary: '#dbdee1',
    tertiary: '#b5bac1',
    muted: '#8e9297',
    inverse: '#2e3338',
    link: '#5865f2',
  },

  success: {
    light: '#7df0a0',
    DEFAULT: '#34c759',
    dark: '#1aa03f',
  },
  warning: {
    light: '#ffcf73',
    DEFAULT: '#ff9500',
    dark: '#d97800',
  },
  danger: {
    light: '#ff8d86',
    DEFAULT: '#ff453a',
    dark: '#d9362d',
  },
  info: {
    light: '#8bc8ff',
    DEFAULT: '#5ac8fa',
    dark: '#32a5d6',
  },

  presence: {
    online: '#34c759',
    idle: '#ff9f0a',
    dnd: '#ff453a',
    offline: '#8b93a2',
  },

  border: {
    DEFAULT: '#1e1f22',
    light: '#404249',
    strong: '#4f545c',
  },
} as const;

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const typography = {
  fontFamily: {
    sans: '"SF Pro Display", "SF Pro Text", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Cascadia Code", monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.5rem',
  DEFAULT: '0.75rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '1.875rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 4px 10px rgba(15, 23, 42, 0.05)',
  DEFAULT: '0 10px 24px rgba(15, 23, 42, 0.08)',
  md: '0 18px 40px rgba(15, 23, 42, 0.1)',
  lg: '0 24px 60px rgba(15, 23, 42, 0.12)',
  xl: '0 32px 80px rgba(15, 23, 42, 0.16)',
  none: 'none',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  contextMenu: 1090,
} as const;

export const animation = {
  duration: {
    fast: '140ms',
    normal: '220ms',
    slow: '320ms',
  },
  easing: {
    default: 'cubic-bezier(0.22, 1, 0.36, 1)',
    in: 'cubic-bezier(0.32, 0, 0.67, 0)',
    out: 'cubic-bezier(0.12, 0.84, 0.32, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
} as const;
