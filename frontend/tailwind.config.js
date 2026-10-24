/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        clinical: {
          navy: '#020617', // slate-950
          dark: '#0f172a', // slate-900
          surface: '#1e293b', // slate-800
          border: '#334155', // slate-700
          teal: {
            DEFAULT: '#0d9488',
            hover: '#0f766e',
            light: '#f0fdfa',
          },
          uncertain: {
            bg: '#faf5ff',
            border: '#9333ea',
            text: '#581c87',
            badge: '#f3e8ff',
          }
        }
      }
    },
  },
  plugins: [],
}
