module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  safelist: [
<<<<<<< HEAD
    'text-white', 'text-black', 'text-2xl', 'text-3xl', 'text-indigo-600',
    'font-extrabold', 'tracking-wide', 'tracking-tight',
    'shadow-md', 'shadow-xl',
    'bg-white', 'bg-gradient-to-br', 'from-pink-500', 'to-indigo-600',
    'hover:bg-gray-100', 'px-4', 'py-2', 'rounded', 'text-center',
    'flex', 'justify-between', 'items-center', 'min-h-screen'
=======
    'text-white', 'text-black', 'text-2xl', 'text-3xl', 'font-extrabold',
    'tracking-wide', 'tracking-tight', 'shadow-md', 'shadow-xl',
    'bg-gradient-to-r', 'bg-gradient-to-br', 'from-pink-500',
    'to-indigo-600', 'bg-white', 'text-indigo-600', 'hover:bg-gray-100'
>>>>>>> 0519eb1d546957458b0f7851088ec28511566922
  ],
  theme: { extend: {} },
  plugins: [],
};