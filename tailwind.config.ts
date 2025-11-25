import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "highlight-blue": "#dbeafe",
        "highlight-blue-dark": "#93c5fd",
        "success-green": "#10b981",
        "warm-gray": "#f9f9f9",
        // Dark mode colors
        "dark-bg": "#1a1a1a",
        "dark-card": "#262626",
        "dark-border": "#404040",
        "dark-highlight": "#1e3a5f",
        "dark-highlight-active": "#2563eb",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Libre Baskerville", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
