/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: 'rgb(var(--rf-base) / <alpha-value>)',
        surface: 'rgb(var(--rf-surface) / <alpha-value>)',
        elevated: 'rgb(var(--rf-elevated) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--rf-accent) / <alpha-value>)',
          hover: 'rgb(var(--rf-accent-hover) / <alpha-value>)',
          light: 'rgb(var(--rf-accent-light) / <alpha-value>)',
        },
        'text-primary': 'rgb(var(--rf-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--rf-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--rf-border) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
