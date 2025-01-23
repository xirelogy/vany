<script setup lang="ts">
//#region Imports
import {
  provide,
  useAttrs,
} from 'vue';

import VanyInputGroupRenderRequest from './requests/VanyInputGroupRenderRequest';

import { VanyValidatedResultFunction } from '../types/VanyValidatedResultFunction';
import VanyInputFrameRenderService from './services/VanyInputFrameRenderService';
import VanyServiceProvider from '../internals/VanyServiceProvider';

import {
  KEY as inlineStateKey,
  createInlineState,
} from '../states/inlineState';

import {
  KEY as VanyInputFrameRemoteServiceKey,
  VanyInputFrameRemoteService,
} from '../internals/services/VanyInputFrameRemoteService';

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
  },
};

serviceProvider.registerService(VanyInputFrameRemoteServiceKey, frameRemoteService);

// Provide state
provide(inlineStateKey, createInlineState(true));
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
  const request: VanyInputGroupRenderRequest = {
    vanyClass: 'input-group',
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