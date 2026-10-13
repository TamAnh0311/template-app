import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        app: {
          cream: "rgb(var(--app-cream) / <alpha-value>)",
          card: "rgb(var(--app-card) / <alpha-value>)",
          text: "rgb(var(--app-text) / <alpha-value>)",
          "text-secondary": "rgb(var(--app-text-secondary) / <alpha-value>)",
          "text-muted": "rgb(var(--app-text-muted) / <alpha-value>)",
          accent: "rgb(var(--app-accent) / <alpha-value>)",
          "accent-soft": "rgb(var(--app-accent-soft) / <alpha-value>)",
          border: "rgb(var(--app-border) / <alpha-value>)",
        },
      },
      borderRadius: { "2.5xl": "1.25rem" },
      boxShadow: {
        card: "0 1px 3px rgba(26,23,20,0.04), 0 8px 24px rgba(26,23,20,0.06)",
        "card-hover":
          "0 4px 12px rgba(26,23,20,0.08), 0 16px 40px rgba(26,23,20,0.10)",
        soft: "0 2px 16px rgba(26,23,20,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
