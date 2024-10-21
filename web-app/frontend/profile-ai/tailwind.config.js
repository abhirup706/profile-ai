// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Add your source folder for purge
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Poppins','sans-serif']
      }
    },
  },
  plugins: [],
}
