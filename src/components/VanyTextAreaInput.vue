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

import VanyTextAreaInputRenderRequest from './requests/VanyTextAreaInputRenderRequest';

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
   */
  disabled?: boolean,
  /**
   * Number of rows
   */
  rows?: number,
}>(), {
  name: null,
  modelValue: null,
  codec: null,
  disabled: false,
});

const emits = defineEmits<{
  /**
   * Model value updated
   */
  'update:modelValue': [value: T|null],
  /**
   * Input event
   */
  'input': [value: string, context?: any],
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
  defaultValidateTrigger: 'blur',
  controlNature: 'input',
});

serviceHost.onChangeEvent((value: T|Error|null, rawValue?: string|null, context?: any) => {
  emits('change', value, rawValue, context);
});
serviceHost.onInputEvent((value: string, context?: any) => {
  emits('input', value, context);
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
  const request: VanyTextAreaInputRenderRequest = {
    vanyClass: 'text-area-input',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    name: props.name,
    disabled: props.disabled,
    rows: props.rows ?? null,
    _render: serviceHost.export(),
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>