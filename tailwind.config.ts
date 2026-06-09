import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Cozy tea-party palette
        cream: "#FBF5EC",
        parchment: "#F3E8D7",
        sage: "#A8C3A1",
        "sage-deep": "#7FA277",
        rose: "#E7B7A8",
        "rose-deep": "#D49484",
        lavender: "#C9BCE0",
        cocoa: "#5A4636",
        "cocoa-soft": "#8A7A68",
        honey: "#F0C987",
        matcha: "#C7D8B0"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-rounded", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-rounded", "system-ui", "sans-serif"]
      },
      boxShadow: {
        cozy: "0 8px 24px -8px rgba(90, 70, 54, 0.25)",
        "cozy-lg": "0 18px 50px -12px rgba(90, 70, 54, 0.32)"
      },
      borderRadius: {
        cozy: "1.5rem"
      },
      keyframes: {
        steam: {
          "0%": { transform: "translateY(0) scaleX(1)", opacity: "0" },
          "30%": { opacity: "0.6" },
          "100%": { transform: "translateY(-26px) scaleX(1.4)", opacity: "0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" }
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" }
        },
        pop: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        steam: "steam 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        wiggle: "wiggle 2.5s ease-in-out infinite",
        pop: "pop 0.25s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
