<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyCloseRenderRequest from './requests/VanyCloseRenderRequest';

import VanyCloseRenderService from './services/VanyCloseRenderService';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Main content (normally unused)
   */
  default?: () => any,
}>();

const emits = defineEmits<{
  /**
   * Close item is clicked
   */
  'click': [],
}>();
//#endregion

//#region Internal setup
// Create render service
const renderService: VanyCloseRenderService = {
  /**
   * @inheritdoc
   */
  notifyClick() {
    emits('click');
  },
};
//#endregion

//#region Renderer
const render = () => {
  const request: VanyCloseRenderRequest = {
    vanyClass: 'close',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    _render: renderService,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>