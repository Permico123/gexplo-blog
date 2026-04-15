import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gexplo: {
          bg: "#F8F7F4",
          "bg-alt": "#F2F0EB",
          dark: "#1C3A2B",
          primary: "#2D6A4F",
          accent: "#40916C",
          water: "#4A90A4",
          "water-light": "#D4EBF1",
          earth: "#8B7355",
          "earth-light": "#EDE8DF",
          border: "#D8D4CC",
          muted: "#6B7C74",
          text: "#2C3E35",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#2C3E35",
            h2: { color: "#1C3A2B" },
            h3: { color: "#1C3A2B" },
            strong: { color: "#1C3A2B" },
            blockquote: {
              borderLeftColor: "#40916C",
              color: "#2D6A4F",
              fontStyle: "italic",
            },
            a: { color: "#2D6A4F" },
          },
        },
      },
      maxWidth: {
        "editorial": "760px",
        "wide": "1100px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
