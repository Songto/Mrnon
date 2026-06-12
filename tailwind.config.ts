import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Structural tokens are CSS-variable driven so they flip in dark mode
        // (see :root / .dark in globals.css). Accents stay constant.
        night: "#41301F", // warm dark brown (text on bright accents)
        cream: "rgb(var(--c-cream) / <alpha-value>)", // page background
        parchment: "rgb(var(--c-parchment) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)", // cards / panels
        "surface-soft": "rgb(var(--c-surface-soft) / <alpha-value>)",
        cocoa: "rgb(var(--c-cocoa) / <alpha-value>)", // primary text
        "cocoa-soft": "rgb(var(--c-cocoa-soft) / <alpha-value>)", // muted text
        strawberry: "#FF7E9B",
        "strawberry-deep": "#FF6385",
        rose: "#FFB3C7",
        "rose-deep": "#FF8FAE",
        sage: "#A9D6A0",
        "sage-deep": "#7FB976",
        lavender: "#C9BCE0",
        honey: "#FBD08A",
        matcha: "#C7E0AE",
        sky: "rgb(var(--c-sky) / <alpha-value>)" // soft sky / cloud backdrop
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-rounded", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-rounded", "system-ui", "sans-serif"]
      },
      boxShadow: {
        // layered: a tight contact shadow + a soft warm halo, so cards lift
        // clearly off the cream background
        cozy: "0 2px 5px rgba(193, 124, 90, 0.16), 0 12px 30px -10px rgba(193, 124, 90, 0.5)",
        "cozy-lg": "0 3px 8px rgba(193, 124, 90, 0.2), 0 22px 54px -14px rgba(193, 124, 90, 0.55)",
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
