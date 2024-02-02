import type { DirectiveBinding, Directive } from 'vue';

type DocumentHandler = <T extends MouseEvent>(e: T) => void;

interface ListProps {
  el: HTMLElement;
  documentHandler?: DocumentHandler;
}

const nodeList: ListProps[] = [];

interface IOptions {
  ignores?: string | string[];
}
const isIgnoresElement = (options: IOptions | undefined = {}, target: HTMLElement) => {
  if (!options) {
    return false;
  }
  if (!target) {
    return false;
  }
  const { ignores = [] } = options;
  if (typeof ignores === 'string') {
    return document.querySelector(ignores)?.contains(target);
  } else if (Array.isArray(ignores) && ignores.length > 0) {
    return ignores.every(element => {
      return document.querySelector(element)?.contains(target);
    });
  }
  return false;
};
/**
 * 创建文档事件
 *
 * @param el HTMLElement
 * @param binding binding
 * @returns Function
 */
function createDocumentHandler(el: HTMLElement, binding: DirectiveBinding): DocumentHandler {
  return function (e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (el.contains(target)) {
      return false;
    }
    if (isIgnoresElement(binding.arg as IOptions, target)) {
      return false;
    }
    binding.value(e);
  };
}

const clickOutsideHandle = (e: MouseEvent) => {
  nodeList.forEach(item => {
    const { documentHandler } = item;
    if (documentHandler && typeof documentHandler === 'function') {
      documentHandler(e);
    }
  });
};

const clickOutside: Directive = {
  mounted(el, binding) {
    const index = nodeList.findIndex(item => {
      return item.el === el;
    });
    if (index === -1) {
      nodeList.push({
        el: el,
        documentHandler: createDocumentHandler(el, binding),
      });
      if (nodeList.length === 1) {
        window.addEventListener('click', clickOutsideHandle);
      }
    }
  },
  beforeUnmount(el, binding) {
    const elInNodeListIndex = nodeList.findIndex(item => {
      return item.el === el;
    });
    if (elInNodeListIndex !== -1) {
      nodeList.splice(elInNodeListIndex, 1);
      if (nodeList.length === 0) {
        window.removeEventListener('click', clickOutsideHandle);
      }
    }
  },
};
export const name = 'ClickOutside';
export default clickOutside;
