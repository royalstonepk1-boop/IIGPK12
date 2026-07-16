/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: "#0A2E24",
          900: "#0F3B2E",
          800: "#154A39",
          700: "#1D5D48",
        },
        gold: {
          400: "#D9B968",
          500: "#C9A24B",
          600: "#AC8636",
        },
        ivory: "#F8F5EF",
        stone: {
          600: "#6B6459",
          700: "#524C43",
          900: "#211E1A",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      backgroundImage: {
        facet:
          "radial-gradient(120% 120% at 10% 0%, rgba(217,185,104,0.10) 0%, rgba(217,185,104,0) 45%), radial-gradient(120% 120% at 90% 100%, rgba(21,74,57,0.35) 0%, rgba(21,74,57,0) 50%)",
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(10, 46, 36, 0.35)",
      },
    },
  },
  plugins: [],
}

