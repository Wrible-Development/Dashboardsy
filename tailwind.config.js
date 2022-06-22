module.exports = {
  content: ["./pages/**/*.{html,js,jsx}", "./components/**/*.{html,js,jsx}"],
  plugins: [
    require('@tailwindcss/forms')({
      "strategy": "base"
    }),
  ],
  darkMode: 'class'
}
