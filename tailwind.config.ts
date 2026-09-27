import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#202338",
        bone: "#FFF8EF",
        muted: "#B9B9C7",
        brand: {
          DEFAULT: "#FFA985",
          300: "#FFD3C0",
          400: "#FFBC9F",
          500: "#FFA985",
          600: "#F29470",
          700: "#AD4522",
        },
        neutral: {
          950: "#1B1E31",
          900: "#252940",
          850: "#292D46",
          800: "#2D314B",
          700: "#383C58",
          600: "#44485F",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-ar)", "system-ui", "sans-serif"],
        serif: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { container: "1240px" },
      borderRadius: { button: "14px", card: "24px" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "marquee-rtl": { from: { transform: "translateX(0)" }, to: { transform: "translateX(50%)" } },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pulse2: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
        draw: { from: { strokeDashoffset: "24" }, to: { strokeDashoffset: "0" } },
        grow: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        "marquee-rtl": "marquee-rtl 45s linear infinite",
        "fade-up": "fade-up .9s cubic-bezier(.16,1,.3,1) both",
        float: "float 6s ease-in-out infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
