import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    // Define global variables
    define: {
      // This makes import.meta.env available instead of process.env
      // which is more compatible with Vite
      '__APP_ENV__': JSON.stringify(env.NODE_ENV || 'development'),
    },

    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },

    // Base path for production deployment
    base: '/',

    build: {
      // Output directory that will be served by Netlify
      outDir: 'dist',
      // Generate sourcemaps for better debugging
      sourcemap: false, // Set to true for debugging, false for production
      // Minify output for smaller bundle size
      minify: 'terser',
      // Split chunks for better caching
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            router: ['react-router-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            utils: ['axios', 'formik', 'yup', 'date-fns']
          }
        }
      }
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@mui/icons-material',
        'framer-motion',
        'date-fns',
        'formik',
        'yup',
        'axios'
      ]
    }
  };
});