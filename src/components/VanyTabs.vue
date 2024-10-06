<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyTabsRenderRequest from './requests/VanyTabsRenderRequest';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Tab panes
   */
  default: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyTabsRenderRequest = {
    vanyClass: 'tabs',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>