{import('tailwindcss').Config}
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
mode:'jit'

// https://vite.dev/config/
export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Roboto: ['Roboto', 'sans-serif'],
      Poppins: ['Poppins', 'sans-serif'],
    },
    extend: {
      screens: {
        '1000px': '1050px',
        '1100px': '1110px',
        '800px': '800px',
        '1300px': '1300px',
        '400px': '400px',
      },
    },
  },
  plugins: [react()],
})
