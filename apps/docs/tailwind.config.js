/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#fa9819',
          600: '#ea7d11',
          700: '#cd4900',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        ink: {
          50: '#f6f8fb',
          100: '#e8ebef',
          200: '#deeefe',
          300: '#c6ebf7',
          400: '#b6c9cf',
          500: '#48749e',
          600: '#335775',
          700: '#284760',
          800: '#1e3d59',
          900: '#162f45',
          950: '#0f1d2b',
        },
      },
      fontFamily: {
        sans: ['"Rethink Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Hedvig Letters Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
};
