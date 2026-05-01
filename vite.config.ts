import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // La base debe coincidir exactamente con el nombre de tu repositorio en GitHub
    base: '/store-builder-ai/', 

    plugins: [
      react(), 
      tailwindcss()
    ],

    // Definición de variables globales para el uso de la API de Gemini
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        // Ajustamos el alias '@' para que apunte a la carpeta 'src' 
        // Esto evita errores al importar '../constants/standards'
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      // Optimizamos la salida para asegurar que los assets se carguen bien
      outDir: 'dist',
      assetsDir: 'assets',
    },

    server: {
      // Mantenemos HMR activo a menos que se indique lo contrario
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
