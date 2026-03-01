/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        primary: '#3b82f6',
        success: '#10b981',
      },
    },
  },
  plugins: [],
}
