/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        likecoin: {
            100: '#d4e0e2',
            200: '#a9c1c5',
            300: '#7ea2a8',
            400: '#53838b',
            500: '#28646e',
            600: '#205058',
            700: '#183c42',
            800: '#10282c',
            900: '#081416',
        },
      },
    },
  },
  plugins: [],
  prefix: "lk-",
}
