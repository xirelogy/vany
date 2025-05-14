<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyTagRenderRequest from './requests/VanyTagRenderRequest';

import { VanyTagType } from '../types/VanyTagType';
import VanyTagRenderService from './services/VanyTagRenderService';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Tag type
   */
  type?: VanyTagType,
  /**
   * If light
   */
  light?: boolean,
  /**
   * If close button available
   */
  closable?: boolean,
}>(), {
  type: 'primary',
  light: false,
  closable: false,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Main content
   */
  default: () => any,
}>();

const emits = defineEmits<{
  /**
   * Tag is clicked
   */
  'click': [],
  /**
   * Tag is closed (close button clicked)
   */
  'close': [],
}>();
//#endregion

//#region Internal setup
// Create render service
const renderService: VanyTagRenderService = {
  /**
   * @inheritdoc
   */
  notifyClick() {
    emits('click');
  },

  /**
   * @inheritdoc
   */
  notifyClose() {
    emits('close');
  },
};
//#endregion

//#region Renderer
const render = () => {
  const request: VanyTagRenderRequest = {
    vanyClass: 'tag',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    type: props.type,
    light: props.light,
    closable: props.closable,
    _render: renderService,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>