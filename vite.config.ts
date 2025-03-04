import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Увеличиваем лимит предупреждений
    cssCodeSplit: true, // Разделение CSS на отдельные файлы
  },
});
