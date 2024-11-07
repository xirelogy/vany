<script setup lang="ts">
//#region Imports
import {
  provide,
  useAttrs,
} from 'vue';

import {
  _cast,
} from '@xirelogy/xwts';

import VanyTableRenderRequest from './requests/VanyTableRenderRequest';

import { type VanyTableRowKeyFunction } from '../types/VanyTableRowKeyFunction';

import {
  KEY as namePrefixStateKey,
  createNamePrefixState,
} from '../states/namePrefixState';

import {
  KEY as tableRowKeyState,
  createTableRowKeyState,
} from '../states/tableRowKeyState';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  data?: any[],
  bordered?: boolean,
  rowKey?: VanyTableRowKeyFunction,
  namePrefix?: string,
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

//#region Internal setup
// Provide states
provide(namePrefixStateKey, createNamePrefixState(props.namePrefix));
provide(tableRowKeyState, createTableRowKeyState(props.rowKey));
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