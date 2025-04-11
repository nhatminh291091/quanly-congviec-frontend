module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  safelist: [
    'border', 'table-auto', 'border-collapse', 'whitespace-pre-wrap',
    'break-words', 'hover:bg-indigo-50',
    'bg-white', 'bg-indigo-100',
    'bg-green-200', 'text-green-800',
    'bg-yellow-200', 'text-yellow-800',
    'bg-red-200', 'text-red-800'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
