import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        surface: '#f7f9fc',
        card: '#ffffff',
        text: {
          base: '#0f172a',
          subtle: '#64748b',
        },
      },
      borderRadius: {
        card: '16px',
        xl: '16px',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(2, 8, 23, 0.06)',
        card: '0 10px 30px rgba(2, 8, 23, 0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero': 'linear-gradient(135deg, #3b82f6 0%, #22c1c3 100%)',
      },
    },
  },
  plugins: [],
}
export default config
