import { DirectiveBinding, Directive } from 'vue';

export const ResizeObserver: Directive = {
  mounted(el, binding: DirectiveBinding<any>) {
    const handler = binding.value;

    const resizeObserver = new window.ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          handler();
        }
      }
    });
    resizeObserver.observe(el);
    el._config = {
      resizeObserver,
    };
  },
  unmounted(el: any) {
    if (!el._config) return;
    const { resizeObserver } = el._config;
    resizeObserver.unobserve(el);
    delete el._config;
  },
};

export default ResizeObserver;
