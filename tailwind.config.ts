import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        custom: {
          "dark-gray": {
            dropdown: "#3C3C44",
            idk: "#404048",
          },
          gray: {
            600: "#787882",
            300: "#B4B4BE",
            200: "#C8C8DC",
            150: "#D2D2E1",
            100: "#DCDCE6",
            75: "#EBEBF5",
            50: "#F5F5FF",
            25: "#FAFAFF",
          },
          dark: {
            900: "#0C0C10",
            800: "#18181C",
            700: "#202024",
            600: "#2C2C30",
            500: "#343438",
            400: "#404044",
            300: "#4C4C50",
            200: "#58585C",
            100: "#646468",
            10: "#949498",
          },
          "dark-blue": "#001229",
          black: "#0C0C14",
        },
        primary: {
          50: "#CCE2FF",
          100: "#99C5FF",
          200: "#7FB6FF",
          300: "#328BFF",
          400: "#197CFF",
          500: "#006EFF",
          600: "#0063E5",
          700: "#0058CC",
          800: "#004DB2",
          900: "#004299",
        },
        secondary: {
          50: "#FFEEE5",
          100: "#FFCBB3",
          200: "#FFA880",
          300: "#FF854D",
          400: "#FF621A",
          500: "#FF5000",
          600: "#E64900",
          700: "#CC4100",
          800: "#B33900",
          900: "#802800",
        },
        "light-gray": {
          50: "#FAFAFD",
          100: "#F2F2F5",
          200: "#E6E6E9",
          300: "#D9D9DC",
          400: "#CCCCCF",
          500: "#BFBFC2",
          600: "#B3B3B6",
          700: "#A6A6A9",
          800: "#99999C",
          900: "#8C8C8F",
        },
        "dark-gray": {
          50: "#444444",
          100: "#404040",
          200: "#363636",
          300: "#323232",
          400: "#282828",
          500: "#242424",
          600: "#202020",
          700: "#161616",
          800: "#121212",
          900: "#080808",
        },
        success: {
          50: "#E9FCF0",
          100: "#BDF5D3",
          200: "#A7F1C5",
          300: "#7BEAA7",
          400: "#50E28A",
          500: "#24DB6D",
          600: "#20C562",
          700: "#1DAF57",
          800: "#158441",
          900: "#0E582C",
        },
        information: {
          50: "#F5F0FF",
          100: "#D1B3FF",
          200: "#B380FF",
          300: "#944DFF",
          400: "#751AFF",
          500: "#6600FF",
          600: "#5C00E6",
          700: "#5200CC",
          800: "#4700B3",
          900: "#3D0099",
        },
        warning: {
          50: "#FEF5EF",
          100: "#FBE1B6",
          200: "#FAD79E",
          300: "#F8C36D",
          400: "#F6AF3C",
          500: "#F5A623",
          600: "#F59B0A",
          700: "#DC8B09",
          800: "#B67206",
          900: "#935D06",
        },
        error: {
          50: "#FFE5E5",
          100: "#FFB3B3",
          200: "#FF8080",
          300: "#FF4D4D",
          400: "#FF1A1A",
          500: "#EE0000",
          600: "#CC0000",
          700: "#B30000",
          800: "#990000",
          900: "#800000",
        },
        highlight: {
          50: "#FFE5F2",
          100: "#FFB3D9",
          200: "#FF99CC",
          300: "#FF66B2",
          400: "#FF3399",
          500: "#FF0080",
          600: "#E60073",
          700: "#CC0066",
          800: "#B30059",
          900: "#99004C",
        },
      },
      backgroundColor: {
        primary: {
          50: "#CCE2FF",
          100: "#99C5FF",
          200: "#7FB6FF",
          300: "#328BFF",
          400: "#197CFF",
          500: "#006EFF",
          600: "#0063E5",
          700: "#0058CC",
          800: "#004DB2",
          900: "#004299",
        },
        secondary: {
          50: "#FFEEE5",
          100: "#FFCBB3",
          200: "#FFA880",
          300: "#FF854D",
          400: "#FF621A",
          500: "#FF5000",
          600: "#E64900",
          700: "#CC4100",
          800: "#B33900",
          900: "#802800",
        },
        "light-gray": {
          50: "#FAFAFD",
          100: "#F2F2F5",
          200: "#E6E6E9",
          300: "#D9D9DC",
          400: "#CCCCCF",
          500: "#BFBFC2",
          600: "#B3B3B6",
          700: "#A6A6A9",
          800: "#99999C",
          900: "#8C8C8F",
        },
        "dark-gray": {
          50: "#444444",
          100: "#404040",
          200: "#363636",
          300: "#323232",
          400: "#282828",
          500: "#242424",
          600: "#202020",
          700: "#161616",
          800: "#121212",
          900: "#080808",
        },
        success: {
          50: "#E9FCF0",
          100: "#BDF5D3",
          200: "#A7F1C5",
          300: "#7BEAA7",
          400: "#50E28A",
          500: "#24DB6D",
          600: "#20C562",
          700: "#1DAF57",
          800: "#158441",
          900: "#0E582C",
        },
        information: {
          50: "#F5F0FF",
          100: "#D1B3FF",
          200: "#B380FF",
          300: "#944DFF",
          400: "#751AFF",
          500: "#6600FF",
          600: "#5C00E6",
          700: "#5200CC",
          800: "#4700B3",
          900: "#3D0099",
        },
        warning: {
          50: "#FEF5EF",
          100: "#FBE1B6",
          200: "#FAD79E",
          300: "#F8C36D",
          400: "#F6AF3C",
          500: "#F5A623",
          600: "#F59B0A",
          700: "#DC8B09",
          800: "#B67206",
          900: "#935D06",
        },
        error: {
          50: "#FFE5E5",
          100: "#FFB3B3",
          200: "#FF8080",
          300: "#FF4D4D",
          400: "#FF1A1A",
          500: "#EE0000",
          600: "#CC0000",
          700: "#B30000",
          800: "#990000",
          900: "#800000",
        },
        highlight: {
          50: "#FFE5F2",
          100: "#FFB3D9",
          200: "#FF99CC",
          300: "#FF66B2",
          400: "#FF3399",
          500: "#FF0080",
          600: "#E60073",
          700: "#CC0066",
          800: "#B30059",
          900: "#99004C",
        },
      },
      borderColor: {
        primary: {
          50: "#CCE2FF",
          100: "#99C5FF",
          200: "#7FB6FF",
          300: "#328BFF",
          400: "#197CFF",
          500: "#006EFF",
          600: "#0063E5",
          700: "#0058CC",
          800: "#004DB2",
          900: "#004299",
        },
        secondary: {
          50: "#FFEEE5",
          100: "#FFCBB3",
          200: "#FFA880",
          300: "#FF854D",
          400: "#FF621A",
          500: "#FF5000",
          600: "#E64900",
          700: "#CC4100",
          800: "#B33900",
          900: "#802800",
        },
        "light-gray": {
          50: "#FAFAFD",
          100: "#F2F2F5",
          200: "#E6E6E9",
          300: "#D9D9DC",
          400: "#CCCCCF",
          500: "#BFBFC2",
          600: "#B3B3B6",
          700: "#A6A6A9",
          800: "#99999C",
          900: "#8C8C8F",
        },
        "dark-gray": {
          50: "#444444",
          100: "#404040",
          200: "#363636",
          300: "#323232",
          400: "#282828",
          500: "#242424",
          600: "#202020",
          700: "#161616",
          800: "#121212",
          900: "#080808",
        },
        success: {
          50: "#E9FCF0",
          100: "#BDF5D3",
          200: "#A7F1C5",
          300: "#7BEAA7",
          400: "#50E28A",
          500: "#24DB6D",
          600: "#20C562",
          700: "#1DAF57",
          800: "#158441",
          900: "#0E582C",
        },
        information: {
          50: "#F5F0FF",
          100: "#D1B3FF",
          200: "#B380FF",
          300: "#944DFF",
          400: "#751AFF",
          500: "#6600FF",
          600: "#5C00E6",
          700: "#5200CC",
          800: "#4700B3",
          900: "#3D0099",
        },
        warning: {
          50: "#FEF5EF",
          100: "#FBE1B6",
          200: "#FAD79E",
          300: "#F8C36D",
          400: "#F6AF3C",
          500: "#F5A623",
          600: "#F59B0A",
          700: "#DC8B09",
          800: "#B67206",
          900: "#935D06",
        },
        error: {
          50: "#FFE5E5",
          100: "#FFB3B3",
          200: "#FF8080",
          300: "#FF4D4D",
          400: "#FF1A1A",
          500: "#EE0000",
          600: "#CC0000",
          700: "#B30000",
          800: "#990000",
          900: "#800000",
        },
        highlight: {
          50: "#FFE5F2",
          100: "#FFB3D9",
          200: "#FF99CC",
          300: "#FF66B2",
          400: "#FF3399",
          500: "#FF0080",
          600: "#E60073",
          700: "#CC0066",
          800: "#B30059",
          900: "#99004C",
        },
      },
      fontSize: {
        banner: [
          "160px",
          {
            lineHeight: "120px",
          },
        ],
        "2.5xl": [
          "28px",
          {
            lineHeight: "38px",
          },
        ],
      },
      screens: {
        "2xl": "1440px",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
