import type { CSSProperties } from 'vue';
import { isValidKey } from './common';

interface IBinarySearchOption {
  max: number;
  getValue: (v: number) => number;
  match: number;
}
const binarySearch = ({ max, getValue, match }: IBinarySearchOption) => {
  let min = 0;

  while (min <= max) {
    const guess = Math.floor((min + max) / 2);
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
type MeasureText = (str: string, styles: CSSProperties) => number;
const measureText: MeasureText = (str = '', styles) => {
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
type FitString = (str: string, maxWidth: number, styles?: CSSProperties) => string;
export const fitString: FitString = (str, maxWidth, styles = defaultStyles) => {
  const width = measureText(str, styles);
  const ellipsis = '…';
  const ellipsisWidth = measureText(ellipsis, styles);
  if (width <= maxWidth || width <= ellipsisWidth) {
    return str;
  }

  const index = binarySearch({
    max: str.length,
    getValue: guess => {
      return measureText(str.substring(0, guess), styles);
    },
    match: maxWidth - ellipsisWidth,
  });
  return str.substring(0, index) + ellipsis;
};
