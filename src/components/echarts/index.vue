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
import { useThrottleFn } from '@vueuse/core'
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

interface IData {
  name: string;
  value: number;
}
const chartsCurrentData = ref<IData | undefined>();
const option: ECOption = {
  title: {
    text: props.title,
  },
  tooltip: {
    // trigger: 'axis',
    formatter: (params) => {
      try {
        if (Array.isArray(params)) {
          const [data] = params;
          const { name, value } = data;
          chartsCurrentData.value = { name, value };
        } else {
          const { name, value } = params;
          chartsCurrentData.value = { name, value };
        }
      } catch (err) {
        console.log(err);
      }
      return 1;
    },
  },
  axisPointer: {
    show: true,
    type: 'shadow',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    triggerEvent: true,
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
    myCharts = echarts.init(echartsRef.value, null, {
      renderer: 'canvas',
    });
    if (myCharts) {
      myCharts.setOption(option);
      myCharts.on('click', (e) => {
        console.log(e);
      });
      // 鼠标滑过时变成小手
      myCharts.getZr().on('mousemove', param => {
        const pointInPixel= [param.offsetX, param.offsetY];
        if (myCharts.containPixel('grid',pointInPixel)) {//若鼠标滑过区域位置在当前图表范围内 鼠标设置为小手
          myCharts.getZr().setCursorStyle('pointer')
        }else{
          myCharts.getZr().setCursorStyle('default')
        }
      })
      // 点击区域增大
      myCharts.getZr().on('click', params=>{
        const pointInPixel= [params.offsetX, params.offsetY];
        if (myCharts.containPixel('grid',pointInPixel)) {
          const { name, value } = chartsCurrentData.value;
          // 点击的逻辑
          console.log(name, value);
        }
      })
    }
  }
};

const resizeHandle = useThrottleFn(() => {
  if (myCharts) {
    myCharts.resize();
  }
}, 100);
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

defineExpose({
  myCharts,
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
