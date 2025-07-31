const designSystem = require('./src/styles/design_system.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...designSystem.colors,
        // Existing colors are preserved and can be overridden by the design system
        'primary': '#4338CA', 
        'secondary': '#0D9488',
        'accent': designSystem.colors.accent, 
        'background': designSystem.colors.background, 
        'sidebar': designSystem.colors.sidebarBackground, 
        'card': designSystem.colors.cardBackground, 
        'card-light': designSystem.colors.cardBackground,
        'text-primary': designSystem.colors.primaryText,
        'text-secondary': designSystem.colors.secondaryText,
        'border': designSystem.colors.borderColor,
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': designSystem.colors.red,
        'info': '#3B82F6',
        'primary-light': '#6D28D9',
        'accent-light': '#BE185D',

        // Dark mode colors (can be refined later)
        'primary-dark': '#6366F1',
        'secondary-dark': '#14B8A6',
        'accent-dark': '#F472B6',
        'background-dark': '#111827',
        'sidebar-dark': '#1F2937',
        'card-dark': '#1F2937',
        'text-primary-dark': '#F9FAFB',
        'text-secondary-dark': '#9CA3AF',
        'border-dark': '#374151',

        // Glassmorphism colors
        'glass-light': 'rgba(255, 255, 255, 0.25)',
        'glass-dark': 'rgba(255, 255, 255, 0.05)',
        'glass-border-light': 'rgba(255, 255, 255, 0.18)',
        'glass-border-dark': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: [designSystem.typography.fontFamily, 'Inter Variable', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'Inter Variable', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        ...designSystem.typography,
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      boxShadow: {
        ...designSystem.shadows,
        'soft-md': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.07), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'glass-strong': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        'neon': '0 0 5px rgba(67, 56, 202, 0.3), 0 0 10px rgba(67, 56, 202, 0.2)',
        'neon-strong': '0 0 10px rgba(67, 56, 202, 0.5), 0 0 20px rgba(67, 56, 202, 0.3)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'elevation-4': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        'elevation-5': '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      },
      borderRadius: {
        ...designSystem.borderRadius,
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      spacing: {
        ...designSystem.spacing,
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};