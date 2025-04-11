/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // ✅ Quét toàn bộ file trong src/
    './public/index.html'          // ✅ Nếu bạn có HTML template
  ],
  safelist: [
    'border', 'border-collapse', 'table-auto', 'whitespace-pre-wrap',
    'break-words', 'rounded-xl', 'text-sm', 'text-xs', 'text-base',
    'text-slate-800', 'text-slate-900', 'text-gray-700', 'text-gray-800',
    'bg-white', 'bg-indigo-100', 'hover:bg-indigo-50',
    'bg-green-200', 'text-green-800',
    'bg-yellow-200', 'text-yellow-800',
    'bg-red-200', 'text-red-800'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
    },
  },
  plugins: [],
};
