<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyContainerRenderRequest from './requests/VanyContainerRenderRequest';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Prefer tight layout
   */
  tight?: boolean,
}>(), {
  tight: false,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Header content
   */
  header: () => any,
  /**
   * Main content
   */
  default: () => any,
  /**
   * Footer content
   */
  footer: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyContainerRenderRequest = {
    vanyClass: 'container',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    tight: props.tight,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>
