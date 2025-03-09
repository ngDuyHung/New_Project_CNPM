/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#2c5282',
        'button-from': '#2b6cb0',
        'button-to': '#3182ce',
      },
    },
  },
  plugins: [],
} 