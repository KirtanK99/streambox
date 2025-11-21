/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark streaming look
        "sb-bg": "#050509",
        "sb-surface": "#111119",
        "sb-surface-alt": "#181822",
        "sb-accent": "#32e0c4",
        "sb-accent-soft": "#32e0c41a",
      },
      boxShadow: {
        "sb-card": "0 18px 40px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
