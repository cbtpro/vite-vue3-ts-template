<template>
  <ul class="menus">
    <li v-for="menu in menus" :key="menu.name">
      <RouterLink :to="menu.to" :title="menu.name">{{ menu.name }}</RouterLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const menus = ref([
  {
    name: '首页',
    to: '/',
  },
  {
    name: 'Flex Demo',
    to: '/demo/flex-container-demo',
  },
  {
    name: 'html2canvas-demo',
    to: '/demo/html2canvas-demo',
  },
  {
    name: 'virtual-scroller',
    to: '/demo/virtual-scroller',
  },
  {
    name: 'amap',
    to: '/demo/amap',
  },
  {
    name: 'demo1',
    to: '/demo/demo1',
  },
  {
    name: 'http-demo',
    to: '/demo/http-demo',
  },
]);
</script>

<style lang="less" scoped>
.menus {
}
</style>
