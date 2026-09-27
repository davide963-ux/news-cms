/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#EB1E32",
          dark: "#B3121F",
          light: "#FF4D5E",
        },
        ink: {
          DEFAULT: "#14171A",
          soft: "#2A2E33",
        },
        paper: "#FAFAFA",
      },
    },
  },
  plugins: [],
};
