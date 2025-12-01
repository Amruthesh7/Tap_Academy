/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb',
          secondary: '#7c3aed',
          accent: '#f97316',
        },
        surface: {
          100: '#0f172a',
          200: '#1e293b',
          300: '#334155',
        },
      },
    },
  },
  plugins: [],
};

