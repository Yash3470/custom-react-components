/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./stories/**/*.{ts,tsx}",
    "./.storybook/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class'
}