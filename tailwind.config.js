/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'x-blue': '#1DA1F2', // Twitter/X blue
        'x-blue-hover': '#1A91DA', // Darker blue for hover
      },
    },
  },
  plugins: [],
}
