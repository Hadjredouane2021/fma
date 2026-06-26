import type { Config } from "tailwindcss";
import { FMA_HEX } from "./src/lib/fma-brand-colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Charte FMA — Couleurs PRINCIPALES (RVB 148/31/73 · 154/150/174 · 88/88/87) ──
        primary: {
          DEFAULT: FMA_HEX.burgundy,
          50: "#FCE8EE",
          100: "#F5C5D4",
          200: "#E88CA8",
          300: "#D6537C",
          400: "#C43A65",
          500: FMA_HEX.burgundy,
          600: "#76183A",
          700: "#59122C",
          800: "#3B0C1D",
          900: "#1E060F",
        },
        mauve: {
          DEFAULT: FMA_HEX.mauve,
          50: "#F4F3F7",
          100: "#E5E3EC",
          200: "#CBC8D6",
          300: "#B2AEC2",
          400: FMA_HEX.mauve,
          500: "#7E7A93",
          600: "#605D71",
          700: "#454253",
          800: "#2B2933",
          900: "#15141A",
        },
        graphite: {
          DEFAULT: FMA_HEX.graphite,
          50: "#F2F2F1",
          100: "#DCDCDB",
          200: "#B8B8B6",
          300: "#959592",
          400: "#71716F",
          500: FMA_HEX.graphite,
          600: "#444443",
          700: "#333332",
          800: "#222221",
          900: "#111110",
        },
        // ── Charte FMA — Couleurs SECONDAIRES (RVB 179/153/136 · 58/123/171 · 199/216/229) ──
        gold: {
          DEFAULT: FMA_HEX.taupe,
          50: "#F7F2EF",
          100: "#EBDFD8",
          200: "#D9C4B8",
          300: "#C7A998",
          400: FMA_HEX.taupe,
          500: "#967A6A",
          600: "#7A6154",
          700: "#5D493F",
          800: "#3F312A",
          900: "#221814",
        },
        accent: {
          DEFAULT: FMA_HEX.blue,
          50: "#E8F1F8",
          100: "#C5DCEF",
          200: "#8CB9DE",
          300: "#5296CD",
          400: FMA_HEX.blue,
          500: "#2E6289",
          600: "#234A67",
          700: "#173144",
          800: "#0C1922",
          900: "#060D11",
        },
        pale: {
          DEFAULT: FMA_HEX.pale,
          50: "#F4F8FB",
          100: "#E6EFF5",
          200: FMA_HEX.pale,
          300: "#A4BFD3",
          400: "#7FA4BD",
          500: "#5C8AA5",
          600: "#456E87",
          700: "#345367",
          800: "#233846",
          900: "#121D26",
        },
        surface: {
          DEFAULT: "#F8F7F9",
          card: "#FFFFFF",
          border: "#E2E0E8",
        },
      },
      fontFamily: {
        sans: ["Gotham", "system-ui", "sans-serif"],
        display: ["Gotham", "system-ui", "sans-serif"],
        arabic: ["var(--font-ibm-plex-arabic)", "Tahoma", "Arial", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "hero-pattern": `linear-gradient(135deg, ${FMA_HEX.burgundy} 0%, ${FMA_HEX.blue} 50%, ${FMA_HEX.burgundy} 100%)`,
        "gold-gradient": `linear-gradient(135deg, ${FMA_HEX.taupe} 0%, ${FMA_HEX.pale} 100%)`,
        "blue-gradient": `linear-gradient(135deg, ${FMA_HEX.burgundy} 0%, ${FMA_HEX.blue} 100%)`,
        "fma-gradient": `linear-gradient(135deg, ${FMA_HEX.burgundy} 0%, ${FMA_HEX.mauve} 55%, ${FMA_HEX.blue} 100%)`,
        "mauve-gradient": `linear-gradient(135deg, ${FMA_HEX.mauve} 0%, ${FMA_HEX.pale} 100%)`,
        "mesh-light":
          "radial-gradient(at 40% 20%, rgba(148, 31, 73, 0.09) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(58, 123, 171, 0.11) 0px, transparent 45%), radial-gradient(at 0% 50%, rgba(154, 150, 174, 0.12) 0px, transparent 50%), radial-gradient(at 95% 90%, rgba(179, 153, 136, 0.10) 0px, transparent 45%)",
        "mesh-dark":
          "radial-gradient(at 40% 20%, rgba(199, 90, 122, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(58, 123, 171, 0.12) 0px, transparent 45%), radial-gradient(at 10% 80%, rgba(154, 150, 174, 0.10) 0px, transparent 45%), radial-gradient(at 95% 90%, rgba(179, 153, 136, 0.06) 0px, transparent 40%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        card: "0 4px 24px rgba(148, 31, 73, 0.08)",
        "card-hover": "0 12px 48px rgba(148, 31, 73, 0.12)",
        gold: "0 4px 24px rgba(179, 153, 136, 0.25)",
        mauve: "0 4px 24px rgba(154, 150, 174, 0.22)",
        glow: "0 0 0 1px rgba(148, 31, 73, 0.06), 0 24px 64px -12px rgba(148, 31, 73, 0.18)",
        "glow-accent": "0 0 0 1px rgba(58, 123, 171, 0.08), 0 20px 50px -10px rgba(58, 123, 171, 0.2)",
        "glow-mauve": "0 0 0 1px rgba(154, 150, 174, 0.10), 0 20px 50px -10px rgba(154, 150, 174, 0.22)",
        float: "0 8px 32px rgba(15, 23, 42, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-right": "slideRight 0.6s ease-out",
        "count-up": "countUp 2s ease-out",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
