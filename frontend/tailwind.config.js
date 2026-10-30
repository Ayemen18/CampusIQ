/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          dark: '#0f172a',
          sidebar: '#1e293b',
          sidebarHover: '#334155',
          primary: '#2563eb',
          primaryHover: '#1d4ed8',
          accent: '#3b82f6',
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          textMuted: '#64748b',
          textDark: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
