<script setup lang="ts">
//#region Imports
import {
  Stringable,
} from '@xirelogy/xwts';

import {
  useAttrs,
} from 'vue';

import VanyBreadcrumbRenderRequest from './requests/VanyBreadcrumbRenderRequest';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Specific separator between breadcrumb items
   */
  separator?: Stringable|string,
}>(), {
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Breadcrumb items
   */
  default: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyBreadcrumbRenderRequest = {
    vanyClass: 'breadcrumb',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    separator: props.separator,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>