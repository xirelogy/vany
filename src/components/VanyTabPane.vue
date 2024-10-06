<script setup lang="ts">
//#region Imports
import {
  Stringable,
} from '@xirelogy/xwts';

import {
  useAttrs,
} from 'vue';

import {
  type VanyTabKeyValue,
} from '../types/VanyTabKeyValue';

import VanyTabPaneRenderRequest from './requests/VanyTabPaneRenderRequest';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  value: VanyTabKeyValue,
  label?: Stringable|string,
  disabled?: boolean,
}>(), {
  disabled: false,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Tab pane content
   */
  default: () => any,
  /**
   * Tab pane label
   */
  label?: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyTabPaneRenderRequest = {
    vanyClass: 'tab-pane',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    value: props.value,
    label: props.label,
    disabled: props.disabled,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>