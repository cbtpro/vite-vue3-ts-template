<!--
 Copyright 2025 cbtpro

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->
<template>
  <ul class="tab">
    <li
      v-for="(item, index) in list"
      :class="{ selected: currentActiveKey === item }"
      @click="clickHandle(item)"
      class="tab-item"
    >
      <slot name="tab-item" :item="item" :index="index" :list="list">
        {{ item.label }}
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
export interface TabItem {
  label: string;
  key: string;
}
</script>

<script setup lang="ts" generic="T extends TabItem">
import { ref, toRefs, watch } from 'vue';
interface IProps {
  activeKey?: T;
  list: T[];
}
defineOptions({
  name: 'tab',
});

const props = withDefaults(defineProps<IProps>(), {
  activeKey: undefined,
  list: () => [],
});
const emits = defineEmits<{
  (e: 'update:active-key', type: T): void;
  (e: 'change', type: T): void;
}>();

const { activeKey, list } = toRefs(props);
const currentActiveKey = ref<T>(activeKey.value || list.value[0]);
watch(activeKey, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    currentActiveKey.value = newValue;
  }
});
const clickHandle = (value: T) => {
  emits('update:active-key', value);
  emits('change', value);
};
</script>

<style scoped>
.tab {
  display: flex;
  height: 32px;
  margin-bottom: 0;
}

.tab .tab-item {
  /** min-width: 88px; */
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  cursor: pointer;
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  box-shadow: 0 0 0 1px #d1d5df;
}

.tab .tab-item:first-child {
  border-radius: 4px 0 0 0;
}

.tab .tab-item:last-child {
  border-radius: 0 4px 0 0;
}

.tab .tab-item:hover {
  color: #000;
  box-shadow: 0 0 0 1px #3469ec;
}

.tab .tab-item span {
  color: #434b6c;
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  /* 157.143% */
}

.tab .tab-item.selected {
  background: #3469ec;
  box-shadow: 0 0 0 1px #3469ec;
  color: #fff;
}

.tab .tab-item.selected:hover {
  color: #fff;
}
</style>
