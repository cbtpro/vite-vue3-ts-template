<template>
  <div class="home">
    <map-view />
  </div>
</template>

<script setup lang="ts">
import MapView from '@/components/map-view/index.vue';

defineOptions({
  name: 'Home',
});
</script>

<style lang="postcss" scoped>
.home {
  width: 800px;
  height: 400px;
}
</style>
