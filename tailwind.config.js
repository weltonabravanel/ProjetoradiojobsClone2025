/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Verde - Representa a casa de Bragança, mas hoje simboliza as florestas e a natureza.
        primary: {
          50: '#e6f7e8',
          100: '#c3eac7',
          200: '#9edaa3',
          300: '#7acb80',
          400: '#5bbc64',
          500: '#3fa348', // Verde Bandeira
          600: '#389341',
          700: '#2e8135',
          800: '#256d2b',
          900: '#194f1f',
        },
        // Amarelo (Ouro) - Representa a casa de Habsburgo, mas hoje simboliza as riquezas minerais.
        secondary: {
          50: '#fffbea',
          100: '#fff5c7',
          200: '#ffe89b',
          300: '#ffd871',
          400: '#ffc64f',
          500: '#ffb522', // Amarelo Ouro Bandeira
          600: '#e6a41f',
          700: '#cc921c',
          800: '#b38118',
          900: '#8c6413',
        },
        // Azul - Simboliza o céu e a água, ou o céu do Rio de Janeiro no dia da Proclamação da República.
        accent: {
          50: '#e8effb',
          100: '#c5d8f6',
          200: '#a0c0f1',
          300: '#7b9be9',
          400: '#5a79e0',
          500: '#3b58d6', // Azul Bandeira (Próximo)
          600: '#3550c4',
          700: '#2d46b0',
          800: '#263b9c',
          900: '#192b7b',
        },
        // Cor de texto ou fundo neutra (branco)
        neutral: {
            50: '#fcfcfc',
            100: '#f5f5f5',
            500: '#ffffff', // Branco
            900: '#212121',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
