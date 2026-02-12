import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Conceptual "Deep Navy / Indigo / Gold" Theme (Concept UI)
        primary: {
          DEFAULT: '#4F46E5', // Indigo-600
          dark: '#4338CA',    // Indigo-700
          light: '#818CF8',   // Indigo-400
        },
        background: {
          light: '#FFFFFF',
          dark: '#010816',    // Deep Navy
        },
        section: {
          dark: '#0B1120',    // Slightly lighter navy
        },
        code: {
          bg: '#E7E9EB',
          dark: '#111827',    // Gray-900
        },
        accent: {
          gold: '#F59E0B',        // Amber-500
          'gold-hover': '#D97706',// Amber-600
          'gold-light': '#FEF3C7',// Amber-100
        },
        card: {
          border: '#312E81', // Dark indigo for borders
        },
        // Keep existing legacy colors for backward compatibility where needed, 
        // but prefer the new semantic names above.
        midnight: {
          DEFAULT: '#010816', // Updated to match concept
          950: '#010409',
          900: '#010816',
          800: '#0B1120',
          700: '#111827',
        },
        indigo: {
          DEFAULT: '#4F46E5',
          950: '#312E81',
          900: '#3730A3',
          800: '#4338CA',
          700: '#4F46E5',
          600: '#4F46E5',
          500: '#6366F1',
          400: '#818CF8',
        },
        amber: {
          DEFAULT: '#F59E0B',
          950: '#78350F',
          900: '#92400E',
          800: '#B45309',
          700: '#D97706',
          600: '#D97706',
          500: '#F59E0B',
          400: '#FBBF24',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-pool': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        'glass-dark': 'linear-gradient(180deg, rgba(17, 24, 39, 0.7) 0%, rgba(17, 24, 39, 0.3) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #4F46E5, #4338CA)',
        'gradient-gold': 'linear-gradient(135deg, #F59E0B, #D97706)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(245, 158, 11, 0.4)', // Amber glow
        'glow-indigo': '0 0 15px rgba(79, 70, 229, 0.3)', // Indigo glow
        'glow-lg': '0 0 30px rgba(245, 158, 11, 0.5)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(245, 158, 11, 0.7)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#E5E7EB',
            a: {
              color: '#F59E0B',
              '&:hover': {
                color: '#D97706',
              },
            },
            h1: { color: '#FFFFFF' },
            h2: { color: '#FFFFFF' },
            h3: { color: '#FFFFFF' },
            h4: { color: '#FFFFFF' },
            strong: { color: '#FFFFFF' },
            code: { color: '#F59E0B' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
