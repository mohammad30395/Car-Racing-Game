import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 35px rgba(45, 212, 191, 0.24)",
        danger: "0 0 30px rgba(248, 113, 113, 0.24)",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
