<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyButtonRenderRequest from './requests/VanyButtonRenderRequest';
import { type VanyButtonType } from '../types/VanyButtonType';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Button type
   * @defaultValue undefined
   */
  type?: VanyButtonType,
  /**
   * If light
   * @defaultValue false
   */
  light?: boolean,
  /**
   * If disabled
   * @defaultValue false
   */
  disabled?: boolean,
  /**
   * If loading
   * @defaultValue false
   */
  loading?: boolean,
}>(), {
  light: false,
  disabled: false,
  loading: false,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Button display
   */
  default: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyButtonRenderRequest = {
    vanyClass: 'button',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    type: props.type,
    light: props.light,
    disabled: props.disabled,
    loading: props.loading,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>