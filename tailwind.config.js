/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Roboto',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      colors: {
        grain: {
          gold: '#D4A440',
          'gold-light': '#E8C870',
          'gold-dark': '#B8872A',
        },
        growth: {
          green: '#4A7C35',
          'green-light': '#6B9B52',
          'green-dark': '#355A26',
        },
        soil: {
          brown: '#6B4423',
          'brown-light': '#8D6344',
          'brown-dark': '#4A2E16',
        },
        sky: {
          blue: '#5B8AA6',
          'blue-light': '#7FA7BE',
          'blue-dark': '#426B7E',
        },
      },
      fontSize: {
        'body': ['16px', { lineHeight: '1.5' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'heading-1': ['32px', { lineHeight: '1.2' }],
        'heading-2': ['24px', { lineHeight: '1.3' }],
        'heading-3': ['20px', { lineHeight: '1.4' }],
        'heading-4': ['18px', { lineHeight: '1.4' }],
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'zoom-in-95': 'zoom-in-95 0.2s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom-5 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'zoom-in-95': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-from-bottom-5': {
          from: { opacity: '0', transform: 'translateY(1.25rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
