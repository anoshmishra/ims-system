/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      colors: {
        indigo: {
          600: '#4f46e5',
          700: '#4338ca',
        },
        slate: {
          50: '#f8fafc',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}