export default {
  content: [
    "./index.html",
    "./**/*.{js}"
  ],
  safelist: [
    'py-2', 'px-4', 'border', 'uppercase', 'rounded-l', 'rounded-r', 'text-white', 'bg-primary',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#15759e'
      }
    },
  },
  plugins: [],
}