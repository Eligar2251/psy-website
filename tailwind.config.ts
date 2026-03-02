import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ... весь ваш extend из Части 1 остаётся ...

      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#44403c", // stone-700
            h2: {
              color: "#1c1917", // stone-900
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
              color: "#1e7a5a", // primary-600
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
            ul: {
              li: {
                "&::marker": {
                  color: "#42b389", // primary-400
                },
              },
            },
            ol: {
              li: {
                "&::marker": {
                  color: "#42b389",
                },
              },
            },
            code: {
              color: "#1e7a5a",
              backgroundColor: "#f0faf6",
              padding: "2px 6px",
              borderRadius: "4px",
              fontWeight: "400",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;