/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors,
        ...{
          background: "#151515",
          subBackground: "#101010",
          subBackground2: "#222324",
          primary: "#FFC400",
          secondary: "#830ff8",
          buttonBorder: "#2d343e",
          buttonBackground: "#0d0d0d",
          customGrayHeavy: "#424242",
          customGrayLight: "#BBBBBB",
          text: "#CCCCCC",
          input: "#282a36",
          subInput: "#524a5e",
          placeholder: "#7F788D",
        },
      },
    },
  },
  plugins: [],
};
