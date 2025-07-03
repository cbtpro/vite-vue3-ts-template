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
  <Tab v-model:activeKey="activeKey" :list="list" @change="handleTabChange">
    <template #tab-item="{ item, index }"> {{ index }} {{ item.label }} </template>
  </Tab>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tab, { type TabItem } from '@/components/tab/index.vue';

enum INFO_TYPE_ENUM {
  INFO = 'INFO',
  TEST = 'TEST',
  MAP = 'MAP',
}

const list = ref<TabItem[]>([
  {
    label: '物流详情',
    key: INFO_TYPE_ENUM.INFO,
  },
  {
    label: '测试',
    key: INFO_TYPE_ENUM.TEST,
  },
  {
    label: '地图轨迹',
    key: INFO_TYPE_ENUM.MAP,
  },
]);
const activeKey = ref<TabItem>(list.value[0]);
const handleTabChange = (value: TabItem) => {
  console.log(value);
};
</script>
