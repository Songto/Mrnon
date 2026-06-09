import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Dark cottagecore "strawberry teaparty" palette — matches our Discord
        night: "#15101b",
        cream: "#1b1320", // base page background (dark)
        parchment: "#241829", // slightly raised background
        surface: "#2a1d31", // cards / panels
        "surface-soft": "#372741",
        cocoa: "#F5E8F0", // primary text (light on dark)
        "cocoa-soft": "#B6A2C2", // muted text
        strawberry: "#FF5E7E",
        "strawberry-deep": "#FF89A3",
        rose: "#F4A6C0",
        "rose-deep": "#FF8FB0",
        sage: "#9FC79A",
        "sage-deep": "#8FD08A",
        lavender: "#C9BCE0",
        honey: "#F0C987",
        matcha: "#B7D6A0"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-rounded", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-rounded", "system-ui", "sans-serif"]
      },
      boxShadow: {
        cozy: "0 8px 24px -8px rgba(0, 0, 0, 0.55)",
        "cozy-lg": "0 18px 50px -12px rgba(0, 0, 0, 0.6)",
        glow: "0 0 24px -4px rgba(255, 94, 126, 0.45)"
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
