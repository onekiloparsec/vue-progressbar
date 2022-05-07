<template>
  <div :style="style"></div>
</template>

<script>
import { inject, computed } from 'vue';
const inBrowser = typeof window !== 'undefined';

export default {
  name: 'VueProgress',
  serverCacheKey: () => 'Progress',
  setup() {
    const injectedConfig = inject('RADON_LOADING_BAR');
    const defaultConfig = {
      percent: 0,
      options: {
        canSuccess: true,
        show: false,
        color: 'rgb(19, 91, 55)',
        failedColor: 'red',
        thickness: '2px',
        transition: {
          speed: '0.2s',
          opacity: '0.6s',
          termination: 300
        },
        location: 'top',
        autoRevert: true,
        inverse: false
      }
    }

    const progress = inBrowser ? injectedConfig : defaultConfig;

    const style = computed(() => {
      const options = progress.options;
      const isShow = !!options.show;
      const location = options.location;
      const _style = {
        'z-index': 999999,
        'background-color': options.canSuccess ? options.color : options.failedColor,
        opacity: options.show ? 1 : 0,
        position: options.position
      };

      if (location === 'top' || location === 'bottom') {
        location === 'top' ? (_style.top = '0px') : (_style.bottom = '0px');
        if (!options.inverse) {
          _style.left = '0px';
        } else {
          _style.right = '0px';
        }
        _style.width = progress.percent + '%';
        _style.height = options.thickness;
        _style.transition =
          (isShow ? 'width ' + options.transition.speed + ', ' : '') +
          'opacity ' +
          options.transition.opacity;
      } else if (location === 'left' || location === 'right') {
        location === 'left' ? (_style.left = '0px') : (_style.right = '0px');
        if (!options.inverse) {
          _style.bottom = '0px';
        } else {
          _style.top = '0px';
        }
        _style.height = progress.percent + '%';
        _style.width = options.thickness;
        _style.transition =
          (isShow ? 'height ' + options.transition.speed + ', ' : '') +
          'opacity ' +
          options.transition.opacity;
      }
  
      return _style;
    });

    return { progress, style };
  }
};
</script>
