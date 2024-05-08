/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,css,tsx}"],
  daisyui: {
    themes: [{
      "printemps": {
        "primary": "#00D072",
        "secondary": "#E5B420",
        "accent": "#d6d3d1",
        "neutral": "#ffffff",
        "base-100": "#f3f4f6",
        "info": "#9ca3af",
        "success": "#4ade80",
        "warning": "#eab308",
        "error": "#dc2626",
      }
    }, {
      "dohaoasis": {
        "primary": "#C7A965",
        "secondary": "#202B4E",
        "accent": "#d6d3d1",
        "neutral": "#ffffff",
        "base-100": "#f3f4f6",
        "info": "#9ca3af",
        "success": "#4ade80",
        "warning": "#eab308",
        "error": "#dc2626",
      }
    }, {
      "dohaquest": {
        "primary": "#520B75",
        "secondary": "#F2B02D",
        "accent": "#d6d3d1",
        "neutral": "#ffffff",
        "base-100": "#f3f4f6",
        "info": "#9ca3af",
        "success": "#4ade80",
        "warning": "#eab308",
        "error": "#dc2626",
      }
    },],

  },
  plugins: [require("daisyui")],
}

