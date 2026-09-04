/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#0F172A',
          900: '#0A0F1D',
        },
        brand: {
          blue: '#1E40AF',
          lightBlue: '#3B82F6',
          cyan: '#06B6D4',
          orange: '#F97316',
        }
      }
    },
  },
  plugins: [],
}
