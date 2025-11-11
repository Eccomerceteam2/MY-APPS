/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
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
          950: '#172554',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        vibrant: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#06b6d4',
          lime: '#65a30d',
          orange: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'bright': '0 4px 20px -2px rgba(255, 255, 255, 0.1), 0 10px 25px -3px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
        'gradient-vibrant': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #8b5cf6 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #06b6d4 0%, #22c55e 50%, #65a30d 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
        'gradient-blue-green': 'linear-gradient(135deg, #3b82f6 0%, #22c55e 50%, #06b6d4 100%)',
        'gradient-sky-green': 'linear-gradient(135deg, #60a5fa 0%, #4ade80 50%, #06b6d4 100%)',
      }
    },
  },
  plugins: [],
}
