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
        // Futuristic Indigo Purple + Amber Gold Theme
        midnight: {
          DEFAULT: '#0a0b1e',
          950: '#050611',
          900: '#0a0b1e',
          800: '#14162e',
          700: '#1e2140',
          600: '#282c52',
          500: '#323764',
        },
        indigo: {
          DEFAULT: '#4b0082',
          950: '#2d004d',
          900: '#3a0066',
          800: '#4b0082',
          700: '#5c009e',
          600: '#6d00ba',
          500: '#7e0bd6',
          400: '#9933ff',
        },
        amber: {
          DEFAULT: '#ffbf00',
          950: '#b38600',
          900: '#cc9900',
          800: '#ffbf00',
          700: '#ffc933',
          600: '#ffd966',
          500: '#ffe699',
          400: '#fff0cc',
        },
        charcoal: {
          DEFAULT: '#0a0b1e',
          900: '#0a0b1e',
          800: '#14162e',
          700: '#1e2140',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        'glass-indigo': 'linear-gradient(135deg, rgba(75, 0, 130, 0.2), rgba(75, 0, 130, 0))',
        'gradient-amber': 'linear-gradient(135deg, #ffbf00, #ffd966)',
        'gradient-indigo': 'linear-gradient(135deg, #4b0082, #6d00ba)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-amber': '0 0 20px rgba(255, 191, 0, 0.3)',
        'glow-amber-lg': '0 0 40px rgba(255, 191, 0, 0.4)',
        'glow-amber-xl': '0 0 60px rgba(255, 191, 0, 0.5)',
        'glow-indigo': '0 0 20px rgba(75, 0, 130, 0.3)',
        'glow-indigo-lg': '0 0 40px rgba(75, 0, 130, 0.4)',
        'inner-glow-amber': 'inset 0 0 20px rgba(255, 191, 0, 0.1)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 191, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 191, 0, 0.6)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
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
