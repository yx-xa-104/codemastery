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
        // Strict match with homepage.html concept
        primary: "#4F46E5", // Indigo-600
        "primary-dark": "#4338CA", // Indigo-700
        "primary-light": "#818CF8", // Indigo-400
        "background-light": "#FFFFFF",
        "background-dark": "#010816", // Deep Navy requested
        "section-dark": "#0B1120", // Slightly lighter navy for sections
        "code-bg": "#E7E9EB",
        "code-dark": "#111827", // Gray-900
        "accent-gold": "#F59E0B", // Amber-500
        "accent-gold-hover": "#D97706", // Amber-600
        "accent-gold-light": "#FEF3C7", // Amber-100
        "card-border": "#312E81", // Dark indigo for borders

        // Navy palette for lesson/classroom pages (interactive_lesson.html concept)
        navy: {
          950: "#020c1b", // Darkest - header, input backgrounds
          900: "#0a192f", // Main background
          800: "#112240", // Panels, sidebar, code blocks
          700: "#233554", // Borders, lighter elements
        },

        // Aliases for backward compatibility or semantic usage if needed
        indigo: {
          500: '#6366F1',
          900: '#312E81',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
      boxShadow: {
        'glow': '0 0 15px rgba(245, 158, 11, 0.4)',
        'glow-indigo': '0 0 15px rgba(79, 70, 229, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
