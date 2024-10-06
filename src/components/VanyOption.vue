<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyOptionRenderRequest from './requests/VanyOptionRenderRequest';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Option value
   */
  value: string,
  /**
   * If disabled
   * @defaultValue false
   */
  disabled?: boolean,
}>(), {
  disabled: false,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Main content
   */
  default: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyOptionRenderRequest = {
    vanyClass: 'option',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    value: props.value,
    disabled: props.disabled,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>