<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyListRenderRequest from './requests/VanyListRenderRequest';

import { type VanyListMoreFunction } from '../types/VanyListMoreFunction';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = defineProps<{
  /**
   * Specific function to provide more items when asked (list-more)
   */
  listMore?: VanyListMoreFunction,
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Main content
   */
  default: () => any,
  /**
   * Slot to display loading for more
   */
  'list-more-loading': () => any,
  /**
   * Slot to display no more data while loading for more
   */
  'list-more-end': () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyListRenderRequest = {
    vanyClass: 'list',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    listMore: props.listMore ?? null,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>