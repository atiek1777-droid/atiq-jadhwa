import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5400DE",
          hover: "#6D27E8",
        },
        secondary: "#9E2A2B",
        accent: "#E08F3E",
        border: "#B1A7A6",
        canvas: "#FFF8F0",
        ink: "#1D1821",
        muted: "#6E6664",
        sand: "#E9DED5",
        paper: "#FFFFFF",
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "Tahoma", "sans-serif"],
        "arabic-display": ["var(--font-amiri)", "serif"],
        "arabic-accent": ["var(--font-elegance)", "serif"],
        latin: ["var(--font-latin)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1400px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "reveal-up": "reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
