const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    screens: {
      xs: "520px",
      ...defaultTheme.screens,
    },
    extend: {
      spacing: {
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
      },
      fontFamily: {
        serif: ['"Livory"', "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-14": "span 14 / span 14",
        "span-16": "span 16 / span 16",
      },
      transitionProperty: {
        custom: "top, left, transform, box-shadow",
      },
    },
  },
};
