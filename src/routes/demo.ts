import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/demo/index.vue';

const demos: RouteRecordRaw = {
  name: 'demo',
  path: '/demo',
  component: Home,
  redirect: '/demo/helo-world?msg=Vite%20%2B%20Vue',
  meta: {
    title: '首页',
  },
  children: [
    {
      name: 'hello-world',
      path: '/demo/helo-world',
      component: () => import('@/views/demo/hello-world.vue'),
    },
    {
      name: 'flex-container-demo',
      path: '/demo/flex-container-demo',
      component: () => import('@/views/demo/flex-container-demo.vue'),
    },
    {
      name: 'html2canvas-demo',
      path: '/demo/html2canvas-demo',
      component: () => import('@/views/demo/html2canvas-demo/index.vue'),
    },
    {
      name: 'virtual-scroller',
      path: 'virtual-scroller',
      component: () => import('@/views/demo/virtual-scroller/index.vue'),
    },
    {
      name: 'amap',
      path: 'amap',
      component: () => import('@/views/demo/amap/index.vue'),
    },
  ],
};

export default demos;
