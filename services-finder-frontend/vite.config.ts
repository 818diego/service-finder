import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite que Vite escuche en 0.0.0.0 (IP pública).
    port: 5173  // Especifica el puerto en el que quieres que se ejecute Vite.
  }
});
