export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vert principal — repris du logo CTBA (toit + blocs)
        brand: {
          50: '#f0f9f1',
          100: '#dcf0de',
          200: '#b9e1bd',
          300: '#8bcb93',
          400: '#58ac64',
          500: '#358f42',
          600: '#237233',
          700: '#1c5a2a',
          800: '#184722',
          900: '#143a1d',
          950: '#08200f',
        },
        // Orange secondaire — repris du liseré de toit du logo CTBA
        accent: {
          50: '#fff8ec',
          100: '#ffecc8',
          200: '#ffd88c',
          300: '#ffbd52',
          400: '#fca025',
          500: '#f0850f',
          600: '#cc6709',
          700: '#a1500a',
          800: '#82410e',
          900: '#6b360f',
          950: '#3c1b06',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
