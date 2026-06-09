import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Warm & cute "strawberry teaparty" palette — soft pastels, sunny cream
        night: "#5A4636", // warm dark brown (text on bright accents, soft tints)
        cream: "#FFF4E9", // sunny base page background
        parchment: "#FBE7D4", // slightly deeper warm tint
        surface: "#FFFFFF", // cards / panels (used translucent for a soft glass look)
        "surface-soft": "#FFF0E2",
        cocoa: "#5A4636", // primary text (warm brown on cream)
        "cocoa-soft": "#9C8675", // muted text
        strawberry: "#FF7E9B",
        "strawberry-deep": "#FF6385",
        rose: "#FFB3C7",
        "rose-deep": "#FF8FAE",
        sage: "#A9D6A0",
        "sage-deep": "#7FB976",
        lavender: "#C9BCE0",
        honey: "#FBD08A",
        matcha: "#C7E0AE",
        sky: "#CFE9FF" // soft sky for the cloud backdrop
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-rounded", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-rounded", "system-ui", "sans-serif"]
      },
      boxShadow: {
        cozy: "0 10px 26px -10px rgba(214, 150, 120, 0.4)",
        "cozy-lg": "0 20px 50px -14px rgba(214, 140, 120, 0.45)",
        glow: "0 0 26px -4px rgba(255, 126, 155, 0.5)"
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
        },
        // Clouds drifting gently across the sky
        drift: {
          "0%": { transform: "translateX(-20vw)" },
          "100%": { transform: "translateX(120vw)" }
        },
        "drift-bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(10px)" }
        }
      },
      animation: {
        steam: "steam 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        wiggle: "wiggle 2.5s ease-in-out infinite",
        pop: "pop 0.25s ease-out both",
        "drift-bob": "drift-bob 7s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
