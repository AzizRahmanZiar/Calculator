/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'Inter', 'sans-serif'],
      },
      colors: {
        background: '#020617',
        foreground: '#e5e7eb',
        accent: '#38bdf8',
      },
    },
  },
  plugins: [],
};
