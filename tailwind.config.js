module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff3b30', // tamizhakam-like red
        accent: '#014b09',
      },
      fontFamily: {
        tamil: ['"Noto Sans Tamil"', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
};
