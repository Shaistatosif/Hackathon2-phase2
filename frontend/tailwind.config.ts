import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors from constitution
        background: "#1C1C1C",
        card: "#2A2A2A",
        primary: {
          DEFAULT: "#FFA500",
          hover: "#FF8C00",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2A2A2A",
          hover: "#3A3A3A",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#4A4A4A",
          foreground: "#A0A0A0",
        },
        accent: {
          DEFAULT: "#FFA500",
          foreground: "#1C1C1C",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "#3A3A3A",
        input: "#2A2A2A",
        ring: "#FFA500",
        foreground: "#FFFFFF",
        // Status colors
        status: {
          pending: "#FFA500",
          "in-progress": "#3B82F6",
          completed: "#22C55E",
        },
        // Priority colors
        priority: {
          low: "#6B7280",
          medium: "#FFA500",
          high: "#EF4444",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
