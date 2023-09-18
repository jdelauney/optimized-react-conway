/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    extend: {
      gridTemplateColumns: {
        "auto-fill": "repeat(auto-fill, minmax(3px, 16px))",
      },
      colors: {
        primary: {
          50: "#F4F4FB",
          100: "#E9E8F7",
          200: "#CFCEEE",
          300: "#B8B7E6",
          400: "#A2A1DE",
          500: "#8988D5",
          600: "#5755C3",
          700: "#38379B",
          800: "#252466",
          900: "#131335",
          950: "#0A091A"
        },
        secondary: {
          50: "#FFF4E5",
          100: "#FFE9CC",
          200: "#FFD399",
          300: "#FFBD66",
          400: "#FFA733",
          500: "#FF8F00",
          600: "#CC7400",
          700: "#995700",
          800: "#663A00",
          900: "#331D00",
          950: "#190E00"
        },
        accent: {
          50: "#EBF3FE",
          100: "#D8E6FD",
          200: "#B1CEFB",
          300: "#8AB5FA",
          400: "#639CF8",
          500: "#3B82F6",
          600: "#0B60EA",
          700: "#0848B0",
          800: "#053075",
          900: "#03183B",
          950: "#010C1D"
        },
        success: {
          50: "#E9FBF0",
          100: "#CFF7DE",
          200: "#9FEFBC",
          300: "#6FE69B",
          400: "#40DE7A",
          500: "#22C55E",
          600: "#1B9D4B",
          700: "#147538",
          800: "#0D4E25",
          900: "#072713",
          950: "#04160A"
        },
        warning: {
          50: "#FEF8EC",
          100: "#FDF3DD",
          200: "#FCE7BB",
          300: "#FAD994",
          400: "#F8CE72",
          500: "#F6C151",
          600: "#F3AB11",
          700: "#B88109",
          800: "#7E5806",
          900: "#3F2C03",
          950: "#1D1401"
        },
        danger: {
          50: "#FDE7E7",
          100: "#FCCFCF",
          200: "#F99A9A",
          300: "#F56A6A",
          400: "#F23B3B",
          500: "#E90F0F",
          600: "#BB0C0C",
          700: "#8B0909",
          800: "#5B0606",
          900: "#300303",
          950: "#180202"
        },
        info: {
          50: "#EDF7FD",
          100: "#DBEFFB",
          200: "#B6E0F6",
          300: "#8DCEF2",
          400: "#68BFED",
          500: "#44AFE9",
          600: "#1994D6",
          700: "#136EA0",
          800: "#0D4C6D",
          900: "#062637",
          950: "#03131B"
        }
      },

      variants: {

      },
    },
  },
  plugins: [],

  safelist: [
    {
      pattern:
        /(bg|text|border)-(primary|secondary|accent|success|danger|warning|info)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern:
        /(hover:)(bg|hover:text|hover:border)-(primary|secondary|accent|success|danger|warning|info)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern:
        /(focus:)(bg|focus:text|focus:border)-(primary|secondary|accent|success|danger|warning|info)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /(mt|mb|mr|ml|my|mx|px|py|pt|pb|pl|pr)-[0-9]+/
    },
    {
      pattern: /flex-.*/
    },
    {
      pattern: /(bottom|right|top|left)-[0-9]+/
    },
    {
      pattern: /(w|h)-[0-9]+/
    }
  ],

}

