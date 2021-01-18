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
        100: '#f58cf0',
        200: '#ed74e7',
        300: '#e35bdc',
        400: '#d950d2',
        500: '#ba3db4',
        600: '#b830b1',
        700: '#b51dad',
        800: '#a80fa0',
        900: '#990691',
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
