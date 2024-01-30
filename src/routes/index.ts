import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import demo from './demo';

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    redirect: '/demo',
    meta: {
      title: '首页',
    },
  },
  demo,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
