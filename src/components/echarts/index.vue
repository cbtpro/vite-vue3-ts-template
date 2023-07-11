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
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption,
} from 'echarts/charts';
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const props = withDefaults(defineProps<{ title?: string }>(), {
  title: 'ECharts 入门示例',
});
const option: ECOption = {
  title: {
    text: props.title,
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
    },
  ],
};

const echartsRef = ref<HTMLDivElement>();

let myCharts: echarts.ECharts;
const initECharts = () => {
  if (echartsRef.value) {
    myCharts = echarts.init(echartsRef.value);
    if (myCharts) {
      myCharts.setOption(option);
    }
  }
};

const resizeHandle = () => {
  if (myCharts) {
    myCharts.resize();
  }
};
const initEvents = () => {
  window.addEventListener('resize', resizeHandle);
};
onMounted(() => {
  initECharts();
  initEvents();
});

const destroyECharts = () => {
  if (myCharts) {
    myCharts.dispose();
  }
};
const removeEvents = () => {
  window.removeEventListener('resize', resizeHandle);
};

onUnmounted(() => {
  destroyECharts();
  removeEvents();
});
</script>

<template>
  <div ref="echartsRef" class="echarts"></div>
</template>

<style lang="less" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
