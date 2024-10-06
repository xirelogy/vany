<script setup lang="ts">
//#region Imports
import {
  provide,
  useAttrs,
} from 'vue';

import VanyDivRenderRequest from './requests/VanyDivRenderRequest';

import {
  KEY as inlineStateKey,
  createInlineState,
} from '../states/inlineState';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * If inline (flexed horizontally)
   */
  inline?: boolean,
}>(), {
  inline: false,
});

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
provide(inlineStateKey, createInlineState(props.inline));
//#endregion

//#region Renderer
const render = () => {
  const request: VanyDivRenderRequest = {
    vanyClass: 'div',
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