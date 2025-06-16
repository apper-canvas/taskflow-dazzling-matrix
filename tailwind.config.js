/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B47E0',
        secondary: '#8B7FE8',
        accent: '#FF6B6B',
        surface: '#FFFFFF',
        background: '#F7F9FC',
        semantic: {
          success: '#4ADE80',
          warning: '#FBBF24',
          error: '#EF4444',
          info: '#3B82F6'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'bounce-in': 'bounceIn 0.3s ease-out',
        'scale-down': 'scaleDown 0.4s ease-out forwards',
        'checkmark': 'checkmarkDraw 0.3s ease-out'
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        scaleDown: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0.5' }
        },
        checkmarkDraw: {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' }
        }
      }
    },
  },
  plugins: [],
}