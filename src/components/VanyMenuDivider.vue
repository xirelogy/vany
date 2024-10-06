<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyMenuDividerRenderRequest from './requests/VanyMenuDividerRenderRequest';

import {
  useMenuContainerStateType,
} from '../states/menuContainerState';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const attrs = useAttrs();

const slots = defineSlots<{
}>();
//#endregion

//#region Renderer
const render = () => {
  const request: VanyMenuDividerRenderRequest = {
    vanyClass: 'menu-divider',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    containerType: useMenuContainerStateType(),
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>