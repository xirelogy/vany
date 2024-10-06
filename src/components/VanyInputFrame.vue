<script setup lang="ts">
//#region Imports
import {
  useAttrs,
} from 'vue';

import VanyInputFrameRenderRequest from './requests/VanyInputFrameRenderRequest';
import VanyServiceProvider from '../internals/VanyServiceProvider';

import {
  KEY as VanyInputFrameRemoteServiceKey,
  VanyInputFrameRemoteService,
} from '../internals/services/VanyInputFrameRemoteService';

import { VanyValidatedResultFunction } from '../types/VanyValidatedResultFunction';
import VanyInputFrameRenderService from './services/VanyInputFrameRenderService';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
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
  /**
   * Main content
   */
  default: () => any,
}>();
//#endregion

//#region Internal setup
type SimpleFunction = () => void;

// Translators
let onFocusFunction: SimpleFunction = () => {};
let onBlurFunction: SimpleFunction = () => {};
let onValidatedFunction: VanyValidatedResultFunction = () => {};

// Create render service and register
const renderService: VanyInputFrameRenderService = {
  /**
   * @inheritdoc
   */
  onFocus(fn: SimpleFunction): void {
    onFocusFunction = fn;
  },

  /**
   * @inheritdoc
   */
  onBlur(fn: SimpleFunction): void {
    onBlurFunction = fn;
  },

  /**
   * @inheritdoc
   */
  onValidated(fn: VanyValidatedResultFunction): void {
    onValidatedFunction = fn;
  },
};

// Prepare the service provider
const serviceProvider = new VanyServiceProvider();

// Register VanyInputFrameRemoteService
const frameRemoteService: VanyInputFrameRemoteService = {
  /**
   * @inheritdoc
   */
  vanyServiceClass: 'VanyInputFrameRemoteService',

  /**
   * @inheritdoc
   */
  notifyFocus(): void {
    onFocusFunction();
  },

  /**
   * @inheritdoc
   */
  notifyBlur(): void {
    onBlurFunction();
  },

  /**
   * @inheritdoc
   */
  notifyValidated(success: boolean|null, message: string|Error): void {
    onValidatedFunction(success, message);
  }
};

serviceProvider.registerService(VanyInputFrameRemoteServiceKey, frameRemoteService);
//#endregion

//#region Exposed functions
/**
 * Service negotiator
 */
const serviceNegotiator = serviceProvider.negotiator;


defineExpose({
  serviceNegotiator,
});
//#endregion

//#region Renderer
const render = () => {
  const request: VanyInputFrameRenderRequest = {
    vanyClass: 'input-frame',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    disabled: props.disabled,
    _render: renderService,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>
