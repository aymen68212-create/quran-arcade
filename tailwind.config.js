/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF7',
        surface: '#FFFFFF',
        border: '#E8F5EE',
        primary: {
          green: '#10B981',
          dark: '#059669',
        },
        gold: {
          DEFAULT: '#F0C94A',
          dark: '#D97706',
        },
        accent: {
          red: '#EF4444',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
          arabic: '#1B3A2D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Scheherazade New"', 'serif'],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        pill: '8px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(16, 185, 129, 0.08)',
        topbar: '0 1px 8px rgba(16, 185, 129, 0.06)',
        'card-hover': '0 4px 20px rgba(240, 201, 74, 0.25)',
      },
      backgroundImage: {
        'btn-green': 'linear-gradient(135deg, #10B981, #059669)',
        'btn-blue': 'linear-gradient(135deg, #3B82F6, #2563EB)',
        'badge-gold': 'linear-gradient(135deg, #F0C94A, #D97706)',
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        crescent: 'crescent-spin 1.2s ease-in-out infinite',
      },
      keyframes: {
        'crescent-spin': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}
