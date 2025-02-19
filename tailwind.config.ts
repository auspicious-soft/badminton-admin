import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "max-3xl": "2000px",
        "max-2xl": "1536px",
        "max-xl": "1280px",
        "max-lg": "1024px",
        "max-md": "768px",
        "max-sm": "640px",
        "max-xs": "480px",
      },
      colors: {
        background: "(--background)",
        foreground: "var(--foreground)",
        orange: "#F96915",
        darkBlack: "#060606",
      },
      fontFamily: {
        aeonikBold: ["var(--font-AeoniK-Bold)"],
        aeonikRegular: ["var(--font-AeoniK-Regular)"],
        aeonikLight: ["var(--font-AeoniK-Light)"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "18px",
          sm: "18px",
          md: "25px",
          lg: "30px",
          xl: "40px",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
