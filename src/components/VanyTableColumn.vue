<script setup lang="ts" generic="T = any">
//#region Imports
import {
  useAttrs,
} from 'vue';

import {
  _cast,
  Stringable,
} from '@xirelogy/xwts';

import VanyTableColumnRenderRequest from './requests/VanyTableColumnRenderRequest';

import {
  VanyTableColumnContext,
} from '../types/VanyTableColumnContext';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Column key of current column
   */
  columnKey?: string,
  /**
   * Column label
   */
  label?: Stringable|string,
}>(), {
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Column label
   */
  label?: () => any,
  /**
   * Column cell slot
   * @param context Context representing current cell
   */
  default: (context: VanyTableColumnContext<T>) => any,
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyTableColumnRenderRequest = {
    vanyClass: 'table-column',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    columnKey: props.columnKey,
    label: props.label,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>