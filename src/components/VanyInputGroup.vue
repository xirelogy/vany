<script setup lang="ts">
//#region Imports
import {
  provide,
  useAttrs,
} from 'vue';

import VanyInputGroupRenderRequest from './requests/VanyInputGroupRenderRequest';

import {
  KEY as inlineStateKey,
  createInlineState,
} from '../states/inlineState';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Main content
   */
  default: () => any,
}>();
//#endregion

//#region Internal setup
// Provide state
provide(inlineStateKey, createInlineState(true));
//#endregion

//#region Renderer
const render = () => {
  const request: VanyInputGroupRenderRequest = {
    vanyClass: 'input-group',
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