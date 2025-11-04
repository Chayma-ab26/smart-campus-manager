/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        smartcampus: {
          "primary": "#2563eb",     // bleu
          "secondary": "#9333ea",   // violet
          "accent": "#f59e0b",      // jaune-orange
          "neutral": "#f3f4f6",     // gris clair
          "base-100": "#ffffff",    // fond des cartes
          "info": "#3b82f6",
          "success": "#16a34a",
          "warning": "#fbbf24",
          "error": "#ef4444",
        },
      },
    ],
  },
};
