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
        // Custom Midnight Blue + Amber Theme
        midnight: {
          DEFAULT: '#0a0b1e',
          950: '#050611',
          900: '#0a0b1e',
          800: '#14162e',
          700: '#1e2140',
          600: '#282c52',
        },
        indigo: {
          DEFAULT: '#4b0082',
          900: '#3a0066',
          800: '#4b0082',
          700: '#5c009e',
          600: '#6d00ba',
        },
        amber: {
          DEFAULT: '#ffbf00',
          900: '#cc9900',
          800: '#ffbf00',
          700: '#ffc933',
          600: '#ffd966',
          500: '#ffe699',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-amber': '0 0 20px rgba(255, 191, 0, 0.3)',
        'glow-amber-lg': '0 0 40px rgba(255, 191, 0, 0.4)',
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
