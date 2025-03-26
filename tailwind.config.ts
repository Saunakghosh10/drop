import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        caveat: ["var(--font-caveat)"],
        sans: ["var(--font-inter)"],
      },
      colors: {
        wall: {
          background: "#f5f5f5",
          text: "#333333",
          accent: "#000000",
        }
      },
    },
  },
  plugins: [],
};

export default config;
