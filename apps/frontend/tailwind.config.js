/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,css,tsx}"],
  daisyui: {
    themes: [{
      "default": {
        "primary": "#66c7f4",
        "secondary": "#ff1053",
        "accent": "#c1cad6",
        "neutral": "#ffffff",
        "base-100": "#f3f4f6",
        "info": "#9ca3af",
        "success": "#4ade80",
        "warning": "#eab308",
        "error": "#dc2626",
      }
    }],

  },
  plugins: [require("daisyui")],
}

