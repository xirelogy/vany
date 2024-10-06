<script setup lang="ts">
//#region Imports
import {
  provide,
  useAttrs,
} from 'vue';

import {
  KEY as appStateKey,
  createAppState,
} from '../states/appState';

import VanyAppRenderRequest from './requests/VanyAppRenderRequest';

import { type VanyErrorSourceType } from '../types/VanyErrorSourceType';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Main content
   */
  default: () => any,
}>();

const emits = defineEmits<{
  /**
   * An error was captured
   */
  'error': [source: VanyErrorSourceType, err: Error],
}>();
//#endregion

//#region Internal setup
// Register the handle
const appState = createAppState((source: VanyErrorSourceType, err: Error) => {
  emits('error', source, err);
});
provide(appStateKey, appState);
//#endregion

//#region Renderer
const render = () => {
  const request: VanyAppRenderRequest = {
    vanyClass: 'app',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>
