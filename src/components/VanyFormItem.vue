<script setup lang="ts">
//#region Imports
import {
  Stringable,
} from '@xirelogy/xwts';

import {
  onBeforeUnmount,
  provide,
  useAttrs,
} from 'vue';

import VanyFormItemRenderRequest from './requests/VanyFormItemRenderRequest';

import {
  useFormStateRenderService,
} from '../states/formState';

import {
  KEY as formItemStateKey,
  createFormItemState,
} from '../states/formItemState';

import VanyUi from '../features/VanyUi';
import VanyVue from '../setup/VanyVue';

import { VanyFormValidateStringMode } from '../types/VanyFormValidateStringMode';
import { VanyFormValidateArrayMode } from '../types/VanyFormValidateArrayMode';
import { VanyFormValidateTrigger } from '../types/VanyFormValidateTrigger';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  /**
   * Form item label
   */
  label?: Stringable|string,
  /**
   * Form item label (as a subject in messages)
   */
  subjectLabel?: Stringable|string,
  /**
   * If input is required (a.k.a. mandatory)
   * @defaultValue false
   */
  required?: boolean,
  /**
   * Specific validation mode when handling strings
   * @defaultValue 'rejectEmpty'
   */
  validateStringMode?: VanyFormValidateStringMode,
  /**
   * Specific validation mode when handling arrays
   * @defaultValue 'rejectEmpty'
   */
  validateArrayMode?: VanyFormValidateArrayMode,
  /**
   * Specific validation trigger to override the default validation trigger of the kind of control
   * @defaultValue undefined
   */
  validateTrigger?: VanyFormValidateTrigger|undefined,
}>(), {
  required: false,
  validateStringMode: 'rejectEmpty',
  validateArrayMode: 'rejectEmpty',
  validateTrigger: undefined,
});

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Form item control
   */
  default: () => any,
  /**
   * Form item label (slot)
   */
  label?: () => any,
}>();
//#endregion

//#region Internal setup

// Derive subject label
const subjectLabel = (() => {
  if (props.subjectLabel) return props.subjectLabel;
  if (props.label) return VanyUi.untitleText(props.label);

  if (slots.label) {
    const slotContent = slots.label();
    if (slotContent) {
      return VanyUi.untitleText(VanyVue.flattenVNodeAsText(slotContent));
    }
  }

  return undefined;
})();

// Register the handle
const formItemHandle = useFormStateRenderService()?.registerFormItem(props.required, props.validateStringMode, props.validateArrayMode, props.validateTrigger, subjectLabel) ?? null;
provide(formItemStateKey, createFormItemState(formItemHandle));

onBeforeUnmount(() => {
  formItemHandle?.notifyBeforeUnmount();
});
//#endregion

//#region Renderer
const render = () => {
  const request: VanyFormItemRenderRequest = {
    vanyClass: 'form-item',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    label: props.label,
    required: props.required,
    _render: formItemHandle,
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>