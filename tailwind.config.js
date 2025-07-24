/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFBEA',
          100: '#FFF3BF',
          200: '#FFE066',
          300: '#FFD43B',
          400: '#FFC300',
          500: '#FFDD00', // główny żółty/złoty
          600: '#E6C200',
          700: '#BFA100',
          800: '#997F00',
          900: '#665500',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        darkbg: '#10141a',
        darkpanel: '#181c23',
        darktext: '#f3f4f6',
        darksubtle: '#a1a1aa',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 