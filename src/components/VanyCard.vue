<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyCardRenderRequest from './requests/VanyCardRenderRequest';
import { type VanyCardDockValue } from '../types/VanyCardDockValue';
import { type VueClassAttribute } from '../internals/compat-vue';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = defineProps<{
  /**
   * Dock direction of the dock slot (when available)
   */
  dock?: VanyCardDockValue,
  /**
   * Dock class to be applied to the dock slot (when available)
   */
  dockClass?: VueClassAttribute,
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Card body
   */
  default: () => any,
  /**
   * Card header
   */
  header?: () => any,
  /**
   * Card footer
   */
  footer?: () => any,
  /**
   * Card dock (normally an image)
   */
  dock?: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyCardRenderRequest = {
    vanyClass: 'card',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    dock: props.dock,
    dockClass: props.dockClass,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>
