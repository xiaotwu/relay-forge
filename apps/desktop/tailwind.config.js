/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#0f1419',
        surface: '#1a2332',
        elevated: '#243447',
        accent: {
          DEFAULT: '#10b981',
          hover: '#0d9668',
          light: '#34d399',
        },
        'text-primary': '#e4e8ec',
        'text-secondary': '#8899a6',
        border: '#2d3e50',
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
