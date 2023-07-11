<!--
 Copyright 2023 Peter Chen

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

<script setup lang="ts">
import { FlexGap, FlexColumn } from '@/constants/flex';

export interface IFlexProps {
  /** flex的gap属性 */
  gap?: string;
  /** 每行显示几列 */
  flexColumn?: number;
  /** 最小宽度 */
  minWidth?: string;
}
withDefaults(defineProps<IFlexProps>(), {
  gap: FlexGap,
  flexColumn: FlexColumn,
  minWidth: '375px',
});
</script>

<template>
  <div class="flex-item">
    <slot name="default"></slot>
  </div>
</template>

<style lang="less" scoped>
.flex-item {
  flex: 1;
  width: calc((100% - v-bind(gap)) / v-bind(flexColumn));
  min-width: v-bind(minWidth);
  box-sizing: border-box;
}
</style>
