module.exports = {
  purge: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './layouts/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      brand: {
        100: '#ffe6fe',
        200: '#fabef8',
        300: '#f59af2',
        400: '#a3369d',
        500: '#952e8f',
        600: '#8a2785',
        700: '#8a2485',
        800: '#801d7b',
        900: '#751671',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'responsive', ' focus', 'dark'],
      borderColor: ['dark'],
      textColor: ['hover', 'responsive', 'focus', 'dark'],
      borderWidth: ['responsive', 'last', 'hover', 'focus'],
      display: ['dark'],
      visibility: ['hover', 'focus', 'dark'],
    },
  },
  plugins: [],
};
