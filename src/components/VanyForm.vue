<script setup lang="ts">
//#region Imports
import {
  computed,
  provide,
  useAttrs,
} from 'vue';

import VanyFormRenderRequest from './requests/VanyFormRenderRequest';
import VanyFormRenderService from './services/VanyFormRenderService';
import createVanyFormRunner from '../internals/createVanyFormRunner';

import {
  default as VanyFormRunner,
} from '../features/VanyFormRunner';

import {
  KEY as formStateKey,
  createFormState,
} from '../states/formState';

import {
  KEY as inlineStateKey,
  createInlineState,
} from '../states/inlineState';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Associated form model-value
   */
  modelValue?: Record<string, any>|null,
  /**
   * Provide a (pseudo) submit button to ease submission by keyboard
   * @defaultValue false
   */
  submitButton?: boolean,
  /**
   * If disabled
   * @defaultValue false
   */
  disabled?: boolean,
  /**
   * If inline
   * @defaultValue false
   */
  inline?: boolean,
  /**
   * If virtual
   * @defaultValue false
   */
  virtual?: boolean,
}>(), {
  modelValue: null,
  submitButton: false,
  disabled: false,
  inline: false,
  virtual: false,
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
// Declare runner instance
let _runnerService: VanyFormRenderService|null = null;
const _runner = createVanyFormRunner({
  getServiceFn: (service: VanyFormRenderService) => {
  _runnerService = service;
  },
  modelValue: props.modelValue,
});
provide(formStateKey, createFormState(_runnerService));

provide(inlineStateKey, createInlineState(props.inline));
//#endregion

//#region Exposed functions
/**
 * If submission shall be disabled (blocked)
 */
const isSubmitDisabled = computed(() => {
  return _runner.isSubmitDisabled.value;
});


/**
 * Access to runner instance
 * @returns
 */
function runner(): VanyFormRunner {
  return _runner;
}


/**
 * Reset the form
 */
function reset(): Promise<void> {
  return _runner.reset();
}


/**
 * Automatically focus on first input
 */
function autoFocus(): Promise<boolean> {
  return _runner.autoFocus();
}


/**
 * Trigger validation
 * @param isForeground If the validation is caused by foreground activity
 * @returns
 */
function validate(isForeground?: boolean): Promise<boolean> {
  return _runner.validate(isForeground);
}


defineExpose({
  isSubmitDisabled,
  autoFocus,
  reset,
  runner,
  validate,
});
//#endregion

//#region Renderer
const render = () => {
  const request: VanyFormRenderRequest = {
    vanyClass: 'form',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    submitButton: props.submitButton,
    disabled: props.disabled,
    inline: props.inline,
    virtual: props.virtual,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>