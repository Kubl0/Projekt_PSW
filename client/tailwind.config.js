/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        plansza: "url(/src/assets/gra_panel.png)",
      },
    },
  },
  plugins: [],
};
