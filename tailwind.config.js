/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'JosefinSans':['Josefin Sans','sans-serif'],
        'Quicksand':['Quicksand','serif'],
        'Poppins':['Poppins','monospace'],
      },
    },
  },
  plugins: [],
}

