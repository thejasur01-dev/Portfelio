import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Mijozlarimizning saytlari eski iPhone'larda ochilishi kerak bo'lgani kabi,
    // bizning saytimiz ham. Vite standart holda Safari 16.4+ uchun yig'adi.
    target: ['es2020', 'safari14', 'ios14', 'chrome87', 'firefox78', 'edge88'],
  },
});
