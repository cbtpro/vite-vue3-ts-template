<template>
  <div class="html2canvas-demo">
    <div class="text">{{ text }}</div>

    <div class="text two-line">
      <text-overflow :text="rawText" :width="300" :expand-offset="300" :max-lines="2">
        <template v-slot:text="{ text }">
          <span class="text">{{ text }}</span>
        </template>
        <template v-slot:default="{ clickToggle, expanded }">
          <div @click="clickToggle" class="hidden">{{ expanded ? '折叠' : '开' }}</div>
        </template>
      </text-overflow>
    </div>
    <div class="text two-line">
      <text-overflow :text="rawText" :width="300" :expand-offset="20" :max-lines="3">
        <template v-slot:text="{ text }">
          <span class="text">{{ text }}</span>
        </template>
        <template v-slot:default="{ clickToggle, expanded }">
          <div @click="clickToggle" class="more-btn">{{ expanded ? '折叠' : '展开' }}</div>
        </template>
      </text-overflow>
    </div>
    <button @click="doScreenshotHandle">截图</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fitString } from '@/utils/html';
import { screenshot } from '@/utils/screenshot';
import TextOverflow from '@/components/text-overflow/index.vue';

defineOptions({
  name: 'html2cavnas-demo',
});
const rawText = `怒发冲冠，凭阑处、潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切。靖康耻，犹未雪；臣子恨，何时灭？驾长车，踏破贺兰山缺。壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头，收拾旧山河，朝天阙。`;
const textWidth = ref(100);
const text = fitString(rawText, textWidth.value, {
  fontSize: '12px',
});
const textWidthPx = ref(`${textWidth.value}px`);
const doScreenshotHandle = async () => {
  await screenshot(document.body);
};
</script>

<style lang="less" scoped>
.html2canvas-demo {
  .text {
    font-size: 12px;
    width: v-bind(textWidthPx);
  }

  .two-line {
    font-size: 12px;
    text-align: left;

    .text {
      color: orange;
      background-color: #efefef;
    }

    .more-btn {
      font-size: 12px;
      cursor: pointer;
      text-align: left;
      color: blue;
      display: block;
      z-index: 1;
      position: relative;
    }
  }
}
</style>
