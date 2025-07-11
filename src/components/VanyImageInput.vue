<script setup lang="ts" generic="T = string">
//#region Imports
import {
  _cast,
} from '@xirelogy/xwts';

import {
  onBeforeUnmount,
  onMounted,
  useAttrs,
  watch,
} from 'vue';

import VanyImageInputRenderRequest from './requests/VanyImageInputRenderRequest';

import { type VanyUploadFunction } from '../types/VanyUploadFunction';

import { useFormItemStateRenderService } from '../states/formItemState';
import VanyRegisteredFormItemRenderService from './services/VanyRegisteredFormItemRenderService';
import createVanyFormControlRenderServiceHost from '../internals/createVanyFormControlRenderServiceHost';
import VanyFocusFunctionForwarder from '../internals/comps/VanyFocusFunctionForwarder';
import { VanyCodec } from '../codecs/VanyCodec';
import VanyDummyCodec from '../codecs/VanyDummyCodec';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

const props = withDefaults(defineProps<{
  /**
   * Input name
   */
  name?: string|null,
  /**
   * Binding model value
   */
  modelValue?: T|null,
  /**
   * Model value codec
   */
  codec?: VanyCodec<T, string>|null,
  /**
   * If disabled
   * @defaultValue false
   */
  disabled?: boolean,
  /**
   * If deletable
   * @defaultValue true
   */
  deletable?: boolean,
  /**
   * List of acceptable MIME types
   * @defaultValue 'image/png,image/jpeg,image/gif'
   */
  accept?: string,
  /**
   * Upload function
   */
  uploader: VanyUploadFunction<string>,
  /**
   * Specific display width
   */
  displayWidth?: number,
  /**
   * Specific display height
   */
  displayHeight?: number,
}>(), {
  name: null,
  modelValue: null,
  codec: null,
  disabled: false,
  deletable: true,
  accept: 'image/png,image/jpeg,image/gif',
});

const emits = defineEmits<{
  /**
   * Model value updated
   */
  'update:modelValue': [value: T|null],
  /**
   * Change event
   */
  'change': [value: T|Error|null, rawValue?: string|null, context?: any],
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Main content (normally unused)
   */
  default?: () => any,
}>();

//#region Internal setup
// Register functions
const fwdFocus = new VanyFocusFunctionForwarder();

// Register the current input control
let renderService: VanyRegisteredFormItemRenderService|null = null;
if (typeof props.name === 'string') {
  renderService = useFormItemStateRenderService()?.registerControl(props.name, fwdFocus) ?? null;
}

// Create the host
const serviceHost = createVanyFormControlRenderServiceHost<T, string>({
  currentValue: props.modelValue,
  onUpdateValueFn: (value: T|null) => {
    emits('update:modelValue', value);
  },
  fwdFocus,
  codec: props.codec ?? _cast<VanyCodec<T, string>>(new VanyDummyCodec<string>),
  registeredControl: renderService,
  defaultValidateTrigger: 'change',
  controlNature: 'input',
});
serviceHost.onChangeEvent((value: T|Error|null, rawValue?: string|null, context?: any) => {
  emits('change', value, rawValue, context);
});

// Connect to the host
onMounted(() => serviceHost.notifyMounted(props.modelValue));
watch(() => props.modelValue, serviceHost.notifyWatch);
onBeforeUnmount(serviceHost.notifyBeforeUnmount);
//#endregion

//#region Exposed functions
/**
 * Focus into the input
 * @returns
 */
async function focus(): Promise<boolean> {
  return fwdFocus.call();
}


defineExpose({
  focus,
});
//#endregion

//#region Renderer
const render = () => {
  const request: VanyImageInputRenderRequest = {
    vanyClass: 'image-input',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    name: props.name,
    disabled: props.disabled,
    deletable: props.deletable,
    accept: props.accept,
    uploader: props.uploader,
    displayWidth: props.displayWidth,
    displayHeight: props.displayHeight,
    _render: serviceHost.export(),
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>