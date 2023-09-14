const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,vue}"],
   theme: {
      extend: {
         fontFamily: {
            sans: ["Lato", ...defaultTheme.fontFamily.sans],
            mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono],
         },
      },
   },
   plugins: [],
};
