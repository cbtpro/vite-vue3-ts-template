import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'default-passive-events';
import '@/assets/base.less';
import '@/style.css';
import App from '@/App.vue';
import router from '@/routes';

async function prepareApp() {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const { worker } = await import('./mocks/browser');
    return worker.start();
  }

  return Promise.resolve();
}
const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
prepareApp().then(() => {
  app.mount('#app');
});
