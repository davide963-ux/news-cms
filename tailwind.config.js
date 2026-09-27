/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#080C0B",
        soft: "#101816",
        panel: "#15201C",
        line: "#263A32",
        ink: "#F2F5F3",
        mist: "#91A39A",
        mint: {
          DEFAULT: "#79B8A0",
          bright: "#A1E3C5",
          dark: "#5A9680",
        },
        // Alias kept so the (untouched, light-mode) admin dashboard's
        // existing bg-brand/text-brand classes still resolve to the new
        // accent color instead of silently losing their styling.
        brand: {
          DEFAULT: "#79B8A0",
          dark: "#5A9680",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
