/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f2fd",
          100: "#ede4fb",
          500: "#a78bda",
          600: "#8f6fce",
          700: "#7a5ab8",
        },
        ink: "#241b3d",
      },
    },
  },
  plugins: [],
};