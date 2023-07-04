import { fileURLToPath, URL } from 'node:url';
import { defineConfig, ServerOptions } from 'vite';
import vue from '@vitejs/plugin-vue';

const serverOptions: ServerOptions = {
  host: true,
  proxy: {
    '/gateway': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/gateway/, ''),
      configure: (proxy, options) => {
        // proxy 是 'http-proxy' 的实例
      },
    },
    '/socket.io': {
      target: 'ws://localhost:5174',
      ws: true,
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: './',
    server: serverOptions,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
