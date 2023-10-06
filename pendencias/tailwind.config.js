/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    fontFamily: {
      Inter: ['Inter', 'sans-serif'],
      system: ['system-ui', 'serif'],
    },
    extend: {
      boxShadow: {
        'modal': '0 0 10px rgba(0, 0, 0, 1)',
      }
    },
  },
  plugins: [],
}

