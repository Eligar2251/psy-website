import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0faf6",
          100: "#d4f1e5",
          200: "#a9e3cb",
          300: "#72ceab",
          400: "#42b389",
          500: "#2a9670",
          600: "#1e7a5a",
          700: "#1b6249",
          800: "#194e3c",
          900: "#164033",
          950: "#0b2520",
        },
        accent: {
          50: "#fef6ee",
          100: "#fce9d5",
          200: "#f8d0aa",
          300: "#f3ae74",
          400: "#ed8a45",
          500: "#e86d20",
          600: "#d95416",
          700: "#b43e14",
          800: "#903218",
          900: "#742b16",
          950: "#3e1309",
        },
        warm: {
          50: "#faf9f7",
          100: "#f2f0eb",
          200: "#e5e1d8",
          300: "#d2cbbf",
          400: "#b8ada0",
          500: "#a69888",
        },
        cream: "#faf9f7",
      },
      fontFamily: {
        heading: ["var(--font-lora)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 4px 25px -5px rgba(0, 0, 0, 0.06)",
        elevated: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
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
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#44403c",
            h2: {
              color: "#1c1917",
              marginTop: "2em",
              marginBottom: "0.75em",
            },
            h3: {
              color: "#1c1917",
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            h4: {
              color: "#292524",
              marginTop: "1.25em",
            },
            a: {
              color: "#1e7a5a",
              textDecoration: "none",
              fontWeight: "500",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            strong: {
              color: "#1c1917",
            },
            blockquote: {
              color: "#57534e",
              borderLeftColor: "#1e7a5a",
              fontStyle: "normal",
            },
            "ul > li::marker": {
              color: "#42b389",
            },
            "ol > li::marker": {
              color: "#42b389",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;