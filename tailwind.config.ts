import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ember: "hsl(var(--ember))",
        flame: "hsl(var(--flame))",
        electric: "hsl(var(--electric))",
        plasma: "hsl(var(--plasma))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ember-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px hsl(15 90% 55% / 0.3), 0 0 20px hsl(5 85% 50% / 0.1)" },
          "50%": { boxShadow: "0 0 20px hsl(15 90% 55% / 0.6), 0 0 40px hsl(5 85% 50% / 0.3)" },
        },
        "energy-ring": {
          "0%": { transform: "translate(-50%, -50%) scale(1)", opacity: "0.3" },
          "50%": { transform: "translate(-50%, -50%) scale(1.1)", opacity: "0.6" },
          "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: "0.3" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "sigil-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "streak": {
          "0%": { transform: "translateX(-100%) scaleX(0)", opacity: "0" },
          "50%": { opacity: "1", transform: "translateX(0%) scaleX(1)" },
          "100%": { transform: "translateX(100%) scaleX(0)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "ember-pulse": "ember-pulse 2s ease-in-out infinite",
        "energy-ring": "energy-ring 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "sigil-spin": "sigil-spin 20s linear infinite",
        "streak": "streak 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "var(--gradient-radial)",
        "gradient-fire": "var(--gradient-fire)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-ember": "var(--gradient-ember)",
      },
      boxShadow: {
        "ember-sm": "var(--glow-ember-sm)",
        "ember-md": "var(--glow-ember-md)",
        "ember-lg": "var(--glow-ember-lg)",
        "electric-sm": "var(--glow-electric-sm)",
        "electric-md": "var(--glow-electric-md)",
        "fire": "var(--shadow-fire)",
        "elevated": "var(--shadow-elevated)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
