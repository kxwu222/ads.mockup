/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  variants: {
    extend: {},
  },
  // Add custom utilities
  corePlugins: {
    // ...
  },
  // Add custom styles
  extend: {
    '.scrollbar-hide': {
      /* Firefox */
      'scrollbar-width': 'none',
      /* Safari and Chrome */
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  }
};
