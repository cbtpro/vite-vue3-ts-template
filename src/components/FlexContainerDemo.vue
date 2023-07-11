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
import FlexContainer from '@/components/flex-container/index.vue';
import FlexItem from '@/components/flex-container/flex-item.vue';
import ECharts from '@/components/echarts/index.vue';
</script>

<template>
  <div class="container">
    <flex-container>
      <flex-item>
        <div class="box1">
          <ECharts title="demo1" />
        </div>
      </flex-item>
      <flex-item>
        <div class="box2">
          <ECharts title="demo2" />
        </div>
      </flex-item>
      <flex-item>
        <div class="box3">
          <ECharts />
        </div>
      </flex-item>
      <flex-item>
        <div class="box3">
          <ECharts />
        </div>
      </flex-item>
      <flex-item>
        <div class="box3">
          <ECharts />
        </div>
      </flex-item>
    </flex-container>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  .box1,
  .box2,
  .box3,
  .box4 {
    width: 100%;
    height: 400px;
    border: 1px solid #e7e7e7;
  }
}
</style>
