/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d9f1ff',
          200: '#bce4ff',
          300: '#8ed1ff',
          400: '#59b6ff',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#184bb6',
          900: '#19418f',
          950: '#142855',
        },
        accent: {
          50: '#fffbeb',
          100: '#fff3c7',
          200: '#ffe58a',
          300: '#ffd24d',
          400: '#ffbb2d',
          500: '#f9a807',
          600: '#dd8003',
          700: '#b75b06',
          800: '#94470b',
          900: '#7a3b0d',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b0b7c6',
          400: '#8590a8',
          500: '#66718d',
          600: '#525b76',
          700: '#434a60',
          800: '#3a4053',
          900: '#343847',
          950: '#22252f',
        },
        success: { 500: '#16a34a', 600: '#15803d' },
        warning: { 500: '#f59e0b', 600: '#d97706' },
        danger: { 500: '#dc2626', 600: '#b91c1c' },
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        floatySlow: {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-22px) translateX(10px)' },
        },
        spin3d: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientMove: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        riseUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        tilt: {
          '0%,100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        floatySlow: 'floatySlow 9s ease-in-out infinite',
        spin3d: 'spin3d 14s linear infinite',
        pulseRing: 'pulseRing 3s ease-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        gradientMove: 'gradientMove 8s ease infinite',
        riseUp: 'riseUp 0.7s ease-out both',
        marquee: 'marquee 30s linear infinite',
        tilt: 'tilt 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
