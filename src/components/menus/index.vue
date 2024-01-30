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
]);
</script>

<style lang="less" scoped>
.menus {
}
</style>
