module.exports = {
  purge: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './layouts/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
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
