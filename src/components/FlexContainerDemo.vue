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
</script>

<template>
  <div class="container">
    <flex-container>
      <flex-item>
        <div class="box1"></div>
      </flex-item>
      <flex-item>
        <div class="box2"></div>
      </flex-item>
      <flex-item>
        <div class="box3"></div>
      </flex-item>
      <flex-item>
        <div class="box3"></div>
      </flex-item>
      <flex-item>
        <div class="box3"></div>
      </flex-item>
    </flex-container>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
}
.box1 {
  width: 100%;
  height: 200px;
  background-color: #e7e7e7;
}
.box2 {
  width: 100%;
  height: 200px;
  background-color: orange;
}
.box3 {
  width: 100%;
  height: 200px;
  background-color: blue;
}
</style>
