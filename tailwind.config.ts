import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-geist)", "sans-serif"],
        mono: ["var(--font-geist)", "monospace"],
      },
      colors: {
        bg: "#0B0B14",
        surface: "#111120",
        "surface-raised": "#16162A",
        primary: {
          DEFAULT: "#7C4FF0",
          hover: "#9066FF",
          muted: "rgba(124,79,240,0.12)",
        },
        "text-primary": "#F1F5F9",
        "text-muted": "#64748B",
        "text-subtle": "#94A3B8",
        success: {
          DEFAULT: "#22C55E",
          muted: "rgba(34,197,94,0.12)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          muted: "rgba(245,158,11,0.12)",
        },
        error: {
          DEFAULT: "#EF4444",
          muted: "rgba(239,68,68,0.12)",
        },
        info: "#3B82F6",
        border: "rgba(255,255,255,0.06)",
        "border-active": "rgba(124,79,240,0.4)",
      },
      borderRadius: {
        card: "10px",
        input: "6px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124,79,240,0.25)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
