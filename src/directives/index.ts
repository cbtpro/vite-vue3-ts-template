import { App } from 'vue';
import ResizeObserver from './resize-observer';

export const directive = {
  install(app: App) {
    app.directive('resize-observer', ResizeObserver);
  },
};
