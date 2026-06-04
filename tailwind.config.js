/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette "academique editoriale"
        encre: "#14213d",      // bleu nuit profond
        ardoise: "#33415c",    // gris-bleu
        or: "#c8a24b",         // accent dore
        creme: "#faf7f0",      // fond clair
        sable: "#efe9dc",      // surfaces
      },
      fontFamily: {
        // Polices distinctives (chargees dans index.html)
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
