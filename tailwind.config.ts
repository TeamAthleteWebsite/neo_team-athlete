import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        gray: {
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          800: '#1f2937',
        },
      },
    },
  },
  plugins: [],
};

export default config; 