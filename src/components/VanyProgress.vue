<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyProgressRenderRequest from './requests/VanyProgressRenderRequest';

import { type VanyProgressContext } from '../types/VanyProgressContext';
import { type VanyProgressTemplateType } from '../types/VanyProgressTemplateType';
import { type VanyProgressType } from '../types/VanyProgressType';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Progress value in percentage (0~100)
   */
  value: number,
  /**
   * Width of the progress bar
   * @defaultValue 20
   */
  barWidth?: number,
  /**
   * Progress template
   * @defaultValue 'normal'
   */
  template?: VanyProgressTemplateType;
  /**
   * Type
   * @defaultValue 'primary'
   */
  type?: VanyProgressType;
}>(), {
  barWidth: 20,
  template: 'normal',
  type: 'primary',
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Progress display slot
   * @param context Context of current progress
   */
  default: (context: VanyProgressContext) => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyProgressRenderRequest = {
    vanyClass: 'progress',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    value: props.value,
    barWidth: props.barWidth,
    template: props.template,
    type: props.type,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>