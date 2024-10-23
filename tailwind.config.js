/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {      screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },},
  },
  plugins: [],
}

