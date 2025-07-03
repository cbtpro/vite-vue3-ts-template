import { fileURLToPath, URL } from 'node:url';
import { defineConfig, ServerOptions } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { visualizer } from 'rollup-plugin-visualizer';
import { qrcode } from 'vite-plugin-qrcode';
import generateVersionPlugin from './plugins/version-generator';

/** 如果是在codespace环境 */
const isCodeSpaces = process.env.CODESPACES === 'true';

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
export default defineConfig({
  base: './',
  server: serverOptions,
  plugins: [vue(), vueDevTools(), qrcode(), generateVersionPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    /**
     * @see https://rollupjs.org/configuration-options/#output-manualchunks
     */
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      plugins: [
        visualizer({
          open: false,
        }),
      ],
      output: {
        manualChunks: {
          // 将vue生态达成一个vue-bundle-xxx.js的包
          'vue-bundle': ['vue', 'vue-router', 'pinia'],
          // 单独将echarts打一个包
          echarts: ['echarts'],
          axios: ['axios'],
          html2canvas: ['html2canvas'],
        },
      },
    },
  },
});
