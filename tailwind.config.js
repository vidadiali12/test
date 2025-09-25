export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f5f6fa',  // çox açıq, boz-mavi işıq
          100: '#e0e4f2',
          200: '#b8c0e0',
          300: '#8e9bce',
          400: '#6676bb',
          500: '#4a5aa5',  // əsas rəng – göy ilə bənövşəyi qarışıq
          600: '#3a4787',
          700: '#2d3669',
          800: '#1f254b',
          900: '#21274eff'   // çox tünd, demək olar qara-bənövşəyi
        },

        custom: {
          50: '#0c6d29ff',
          100: '#0a4f6eff',
          200: '#7b29aaff',
          300: '#ac4323ff',
          400: '#a3b56a',
          500: '#47030cff',
          600: '#e4b20eff',
          700: '#0a857eff',
          800: '#152f86ff',
          900: '#e9ec10ff',
        },

        customGray: {
          50: 'rgba(160, 160, 160, 1)',
          100: 'rgba(94, 92, 92, 1)',
          200: 'rgba(245, 245, 245, 1)'
        }
      }
    }
  },
  plugins: [],
}
