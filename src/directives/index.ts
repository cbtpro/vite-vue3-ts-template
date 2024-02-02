import { App } from 'vue';
import resizeObserver from './resize-observer';
import clickOutside from './click-outside';

export const directive = {
  install(app: App) {
    app.directive('resize-observer', resizeObserver);
    app.directive('click-outside', clickOutside);
  },
};
