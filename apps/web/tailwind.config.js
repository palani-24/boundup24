/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF5722',
          secondary: '#FFC107',
          bg: '#FCF9F8',
          text: '#1C1B1B',
          muted: '#5B4039',
          accent: '#B02F00',
          tertiary: '#6833EA',
          lightBg: '#FFFFFF',
          border: 'rgba(255, 87, 34, 0.12)',
        },
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4px': '4px',
        '8px': '8px',
        '12px': '12px',
        '16px': '16px',
        '24px': '24px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(28, 27, 27, 0.06)',
        ambient: '0 10px 30px -5px rgba(255, 87, 34, 0.12)',
        glass: '0 8px 32px 0 rgba(28, 27, 27, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
