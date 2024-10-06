<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import { type VanyIconColorType } from '../types/VanyIconColorType';

import VanyIconRenderRequest from './requests/VanyIconRenderRequest';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Icon color (if using standard colors)
   */
  colorType?: VanyIconColorType,
  /**
   * Icon color
   */
  color?: string,
  /**
   * Size of the icon (in px)
   */
  size?: number,
}>(), {
  colorType: undefined,
  color: undefined,
  size: undefined,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Icon component
   */
  default: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyIconRenderRequest = {
    vanyClass: 'icon',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    colorType: props.colorType ?? null,
    color: props.color ?? null,
    size: props.size ?? null,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>