<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyBreadcrumbItemRenderRequest from './requests/VanyBreadcrumbItemRenderRequest';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Item display
   */
  default: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyBreadcrumbItemRenderRequest = {
    vanyClass: 'breadcrumb-item',
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