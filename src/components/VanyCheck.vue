<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyCheckRenderRequest from './requests/VanyCheckRenderRequest';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  modelValue?: boolean|'indeterminate'|null,
  disabled?: boolean,
}>(), {
  modelValue: null,
  disabled: false,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Check label
   */
  default: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyCheckRenderRequest = {
    vanyClass: 'check',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    modelValue: props.modelValue,
    disabled: props.disabled,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>