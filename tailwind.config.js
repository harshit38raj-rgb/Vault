/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: '#070B14',
          light: '#F8FAFC',
        },
        surface: {
          dark: '#0F1629',
          'dark-elevated': '#162038',
          light: '#FFFFFF',
          'light-elevated': '#F1F5F9',
        },
        border: {
          dark: 'rgba(255, 255, 255, 0.08)',
          'dark-strong': 'rgba(255, 255, 255, 0.16)',
          light: '#E2E8F0',
          'light-strong': '#CBD5E1',
        },
        brand: {
          purple: '#8B5CF6',
          'purple-hover': '#7C3AED',
          'purple-light': 'rgba(139, 92, 246, 0.12)',
        },
        semantic: {
          income: '#84CC16',
          'income-bg': 'rgba(132, 204, 22, 0.12)',
          amber: '#F59E0B',
          'amber-bg': 'rgba(245, 158, 11, 0.12)',
          coral: '#F43F5E',
          'coral-bg': 'rgba(244, 63, 94, 0.12)',
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'soft-light': '0 4px 20px rgba(15, 23, 42, 0.06)',
        'elevated-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
