<script setup lang="ts">
import { RouterView } from 'vue-router';
import Menus from '@/components/menus/index.vue';
import VersionNotification from '@/components/app/VersionNotification.vue';
</script>

<template>
  <menus />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <VersionNotification :check-version-duration="1" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
