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
  ],
};

export default demos;
