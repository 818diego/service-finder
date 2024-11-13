/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      blur: {
        'xs': '2px', // Define un nivel de desenfoque muy ligero
      }
    }
  },
  plugins: [],
};
