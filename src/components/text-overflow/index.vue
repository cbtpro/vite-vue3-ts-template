<template>
  <div ref="textOverflowRef" class="text-overflow" :style="boxStyle">
    <span ref="overEllipsisRef">
      <slot name="text" :text="realText">
        {{ realText }}
      </slot>
    </span>
    <span class="slot-box" ref="slotRef" v-if="showSlotNode">
      <slot :click-toggle="toggle" :expanded="expanded">
        <div @click="toggle" class="more-btn">
          {{ expanded ? '折叠' : '展开' }}
        </div>
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, toRefs } from 'vue';

defineOptions({
  name: 'text-overflow',
});

const props = defineProps({
  /**
   * 文本
   */
  text: {
    type: String,
    default: '',
  },
  /**
   * 最多显示行数
   */
  maxLines: {
    type: Number,
    default: 3,
  },
  /**
   * 文字宽度宽度
   */
  width: {
    type: Number,
    default: 0,
  },
  /**
   * 展开按钮的开始的位置
   */
  expandOffset: {
    type: Number,
    default: 145,
  },
  viewType: {
    type: String,
    default: 'expand',
    validator(value: string) {
      return ['expand', 'custom'].indexOf(value) !== -1;
    },
  },
});

const { text, width, maxLines, expandOffset, viewType } = toRefs(props);
const offset = ref(text.value.length);
const expanded = ref(false);
const slotBoxWidth = ref(0);
const textBoxWidth = ref(width.value);
const showSlotNode = ref(false);
const boxStyle = computed(() => {
  if (width.value) {
    return {
      width: width.value + 'px',
    };
  }
  return {};
});
const isCustom = computed(() => {
  return viewType.value === 'custom';
});
const realText = computed(() => {
  // 是否被截取
  const isCutOut = offset.value !== text.value.length;
  let realText = text.value;
  if ((isCutOut && !expanded.value) || (isCutOut && isCustom.value)) {
    realText = text.value.slice(0, offset.value) + '...';
  }
  return realText;
});

const calculateOffset = (from: number, to: number) => {
  nextTick(() => {
    if (Math.abs(from - to) <= 1) {
      return;
    }
    if (isOverflow()) {
      to = offset.value;
    } else {
      from = offset.value;
    }
    offset.value = Math.floor((from + to) / 2);
    calculateOffset(from, to);
  });
};
const isOverflow = () => {
  const { len, lastWidth } = getLines();

  if (len < maxLines.value) {
    return false;
  }
  if (maxLines.value) {
    // 超出部分 行数 > 最大行数 或则  已经是最大行数但最后一行宽度 + 后面内容超出正常宽度
    const lastLineOver = !!(
      len === maxLines.value && lastWidth + slotBoxWidth.value > textBoxWidth.value
    );
    if (len > maxLines.value || lastLineOver) {
      return true;
    }
  }
  return false;
};
const overEllipsisRef = ref<HTMLDivElement>();
const getLines = () => {
  if (!overEllipsisRef.value) {
    return {
      len: 0,
      lastWidth: 0,
    };
  }
  const clientRects = overEllipsisRef.value.getClientRects();
  return {
    len: clientRects.length,
    lastWidth: clientRects[clientRects.length - 1].width,
  };
};
const toggle = () => {
  expanded.value = !expanded.value;
};
const textOverflowRef = ref<HTMLDivElement>();
const slotRef = ref<HTMLSpanElement>();
const init = () => {
  const { len } = getLines();
  if (len > maxLines.value) {
    showSlotNode.value = true;
    nextTick(() => {
      if (!textOverflowRef.value) {
        return;
      }
      slotBoxWidth.value = expandOffset.value;
      textBoxWidth.value = textOverflowRef.value.clientWidth;
      calculateOffset(0, text.value.length);
    });
  }
};
onMounted(init);
</script>

<style lang="less" scoped>
.text-overflow {
  .slot-box {
    display: inline-block;

    .more-btn {
      font-family: PingFangSC-Regular;
      font-size: 26px;
      color: #3981f4;
      letter-spacing: 0;
      font-weight: 400;
    }
  }
}
</style>
