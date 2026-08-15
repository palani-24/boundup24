/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF5A1F',
          secondary: '#FF7A00',
          bg: '#F7F7F7',
          text: '#111111',
          muted: '#666666',
          accent: '#FF5A1F',
          lightBg: '#FFFFFF',
          border: '#E5E7EB',
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
