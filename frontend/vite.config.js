import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd(), 'VITE_');
  const reactAppEnv = loadEnv(mode, process.cwd(), 'REACT_APP_');
  
  const env = { ...viteEnv, ...reactAppEnv };
  
  const define = {
    // Definer process globalt for kompatibilitet med Create React App
    'process.env': JSON.stringify(reactAppEnv),
  };
  
  // Legg til individuelle process.env variabler
  Object.keys(reactAppEnv).forEach(key => {
    if (key.startsWith('REACT_APP_')) {
      define[`process.env.${key}`] = JSON.stringify(reactAppEnv[key]);
      define[`import.meta.env.${key}`] = JSON.stringify(reactAppEnv[key]);
      const viteKey = key.replace('REACT_APP_', 'VITE_');
      if (!viteEnv[viteKey]) {
        define[`import.meta.env.${viteKey}`] = JSON.stringify(reactAppEnv[key]);
      }
    }
  });

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/session': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/sjekk-session': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/klubber': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/baner': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/bruker': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/passord': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/KontaktOss': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/tommeTestdata': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/byer': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/upload': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/BetaleAbo': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/AvslutteAbo': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/runder': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/brukere': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/spillere': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/nyheterListe': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/banerListe': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/filer': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.test.{js,jsx}',
          '**/*.spec.{js,jsx}',
        ],
      },
    },
  };
});
