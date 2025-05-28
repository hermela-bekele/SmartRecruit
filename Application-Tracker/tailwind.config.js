// tailwind.config.js
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/index.css",
    "./src/App.jsx",
    "./src/**/*.{js,jsx,ts,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    forms,
  ],
}