// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-yellow-300',
    'border-yellow-500',
    'text-black'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
