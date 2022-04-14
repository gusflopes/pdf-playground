module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    darkTheme: 'dark',
    themes: [
      {
        mytheme: {
          primary: '#252638',
          secondary: '#2b2a3d',
          accent: '#53c0a9',
          neutral: '#212031', // fundo
          'base-100': '#fafafa',
          info: '#A4C0EA',
          success: '#7DE8D3',
          warning: '#F6C76F',
          error: '#F97358',
        },
      },
      'cupcake',
      'dark',
      'cymk',
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
