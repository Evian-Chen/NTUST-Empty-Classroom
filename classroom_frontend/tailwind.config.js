/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        tmblue: '#004165',
        tmgold: '#D4AF37',
        tmred: '#8A1538',
        tmgreen: '#2E7D32',
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
