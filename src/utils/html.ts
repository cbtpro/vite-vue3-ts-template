import { CSSProperties } from 'vue';
import { isValidKey } from './common';

interface IBinarySearchOption {
  max: number;
  getValue: (v: number) => number;
  match: number;
}
const binarySearch = ({ max, getValue, match }: IBinarySearchOption) => {
  let min = 0;

  while (min <= max) {
    let guess = Math.floor((min + max) / 2);
    const compareVal = getValue(guess);

    if (compareVal === match) {
      return guess;
    }
    if (compareVal < match) {
      min = guess + 1;
    } else {
      max = guess - 1;
    }
  }

  return max;
};

const defaultStyles: CSSProperties = {
  position: 'absolute',
  left: '-100%',
  top: '-100%',
  display: 'inline-block',
  fontSize: '12px',
  visibility: 'hidden',
  alignItems: 'center',
};
type MeasureText = (str: string, styles?: CSSProperties) => number;
const measureText: MeasureText = (str = '', styles = defaultStyles) => {
  const dom = document.createElement('span');
  dom.innerText = str;
  Object.keys(styles).forEach(styleName => {
    if (isValidKey(styleName, styles)) {
      const value = styles[styleName];
      if (value && typeof value === 'string') {
        dom.style[styleName] = value;
      }
    }
  });
  document.body.append(dom);
  const width = dom.getBoundingClientRect().width;
  if (dom) {
    dom.remove();
  }
  return width;
};
type FitString = (str: string, maxWidth: number) => string;
const fitString: FitString = (str, maxWidth) => {
  let width = measureText(str);
  const ellipsis = '…';
  const ellipsisWidth = measureText(ellipsis);
  if (width <= maxWidth || width <= ellipsisWidth) {
    return str;
  }

  const index = binarySearch({
    max: str.length,
    getValue: guess => {
      return measureText(str.substring(0, guess));
    },
    match: maxWidth - ellipsisWidth,
  });
  return str.substring(0, index) + ellipsis;
};

const text = `怒发冲冠，凭阑处、潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切。
  　　靖康耻，犹未雪；臣子恨，何时灭？驾长车，踏破贺兰山缺。壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头，收拾旧山河，朝天阙。`;
fitString(text, 100);
