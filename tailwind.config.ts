import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2A7A5A",
        "deep-green": "#1B4D3A",
        "light-green": "#EAF4EF",
        ink: "#1F2623",
        muted: "#58625D",
        whatsapp: "#1FA855",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -28px rgba(27, 77, 58, 0.30)",
        panel: "0 28px 80px -38px rgba(27, 77, 58, 0.42)",
        button: "0 14px 30px -16px rgba(42, 122, 90, 0.80)",
      },
    },
  },
  plugins: [],
};

export default config;
