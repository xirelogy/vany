<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import {
  _cast,
} from '@xirelogy/xwts';

import VanyTableRenderRequest from './requests/VanyTableRenderRequest';

import { type VanyTableRowKeyFunction } from '../types/VanyTableRowKeyFunction';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  data?: any[],
  bordered?: boolean,
  rowKey?: VanyTableRowKeyFunction,
}>(), {
  data: undefined,
  bordered: false,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Table columns
   */
  default: () => any,
  /**
   * Display for empty table
   */
  empty?: () => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyTableRenderRequest = {
    vanyClass: 'table',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    data: props.data ?? [],
    bordered: props.bordered,
    rowKey: props.rowKey,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>