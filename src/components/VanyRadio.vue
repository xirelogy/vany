<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyRadioRenderRequest from './requests/VanyRadioRenderRequest';

import {
  type VanyRadioValue,
} from '../types/VanyRadioValue';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Radio option value
   */
  value: VanyRadioValue,
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
  default: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyRadioRenderRequest = {
    vanyClass: 'radio',
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