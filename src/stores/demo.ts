import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useDemoStore = defineStore('demo', () => {
  const count = ref(0);
  const increment = () => {
    count.value++;
  };
  return {
    count,
    increment,
  };
});
