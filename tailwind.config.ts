import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        "border-soft": "hsl(var(--border-soft))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        faint: "hsl(var(--faint))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          deep: "hsl(var(--accent-deep))",
          soft: "hsl(var(--accent-soft))",
        },
        gradient: {
          "develop-start": "hsl(var(--gradient-develop-start))",
          "develop-end": "hsl(var(--gradient-develop-end))",
          "preview-start": "hsl(var(--gradient-preview-start))",
          "preview-end": "hsl(var(--gradient-preview-end))",
          "ship-start": "hsl(var(--gradient-ship-start))",
          "ship-end": "hsl(var(--gradient-ship-end))",
        },
      },
      fontFamily: {
        heading: ["Instrument Sans", "Inter", "Arial", "sans-serif"],
        sans: ["Instrument Sans", "Inter", "Arial", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "heading-lg": ["2rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.25em" }],
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        md: "12px",
        lg: "16px",
        pill: "100px",
        full: "9999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
        "3xl": "64px",
        "4xl": "96px",
        section: "128px",
      },
      // One motion voice: every eased transition on the site uses the premium curve.
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.22, 1, 0.36, 1)",
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        swift: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        DEFAULT: "400ms",
        small: "400ms",
        medium: "700ms",
        large: "1100ms",
      },
      keyframes: {
        "loader-object-in": {
          from: { opacity: "0", transform: "translateY(24px) scale(0.9)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "loader-object-out": {
          from: { opacity: "1", transform: "translateY(0) scale(1)" },
          to: { opacity: "0", transform: "translateY(-40px) scale(1.08)" },
        },
        "loader-text-in": { from: { transform: "translateY(110%)" }, to: { transform: "translateY(0)" } },
        "loader-text-out": { from: { transform: "translateY(0)" }, to: { transform: "translateY(-110%)" } },
        "loader-fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "loader-fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "loader-curtain": { from: { transform: "translateY(0)" }, to: { transform: "translateY(-100%)" } },
        "loader-bar": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        "loader-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(-1.5deg)" },
        },
        "loader-shadow": {
          "0%, 100%": { transform: "scaleX(1)", opacity: "0.9" },
          "50%": { transform: "scaleX(0.84)", opacity: "0.55" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(-6px)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translateY(40px)", opacity: "0" },
        },
        "soft-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.45" },
          "70%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "soft-pulse": "soft-pulse 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        "scroll-cue": "scroll-cue 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        "loader-float": "loader-float 4.2s ease-in-out infinite",
        "loader-object-in": "loader-object-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
        "loader-object-out": "loader-object-out 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "loader-text-in": "loader-text-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both",
        "loader-text-out": "loader-text-out 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "loader-fade-in": "loader-fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both",
        "loader-fade-out": "loader-fade-out 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "loader-curtain": "loader-curtain 1.1s cubic-bezier(0.76, 0, 0.24, 1) 0.1s forwards",
        "loader-bar": "loader-bar 3s cubic-bezier(0.37, 0, 0.63, 1) both",
        "loader-shadow": "loader-shadow 4.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
