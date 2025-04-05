import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ["Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        black: "#000000",
        white: "#ffffff",
        brand: "#801d20",
        zinc: {
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          800: "#27272a",
          900: "#18181b",
        },
        yellow: {
          400: "#facc15",
        },
      },
    },
  },
  plugins: [],
};

export default config;
