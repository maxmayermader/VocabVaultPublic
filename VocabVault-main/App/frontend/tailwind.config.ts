/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#e60049',
        secondary: '#18b6f4',
        accent: '#009a1c',
        neutral: {
          light: '#f3f4f6',
          dark: '#1f2937',
        },
        background: {
          light: '#ffffff',
          dark:  '#151b23',
        },
        text: {
          light: '#1f2937',
          dark: '#e5e7eb',
        },
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
}