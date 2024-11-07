<script setup lang="ts" generic="T = VanyCheckValueType">
//#region Imports
import {
  onBeforeUnmount,
  onMounted,
  useAttrs,
  watch,
} from 'vue';

import {
  _cast,
} from '@xirelogy/xwts';

import VanyCheckRenderRequest from './requests/VanyCheckRenderRequest';

import { VanyCheckValueType } from '../types/VanyCheckValueType';

import { useFormItemStateRenderService } from '../states/formItemState';
import VanyRegisteredFormItemRenderService from './services/VanyRegisteredFormItemRenderService';
import createVanyFormControlRenderServiceHost from '../internals/createVanyFormControlRenderServiceHost';
import VanyFocusFunctionForwarder from '../internals/comps/VanyFocusFunctionForwarder';
import { VanyCodec } from '../codecs/VanyCodec';
import VanyDummyCodec from '../codecs/VanyDummyCodec';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
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
   * @defaultValue undefined
   */
  codec?: VanyCodec<T, VanyCheckValueType>|null,
  /**
   * If disabled
   * @defaultValue false
   */
  disabled?: boolean,
}>(), {
  modelValue: null,
  disabled: false,
});

const emits = defineEmits<{
  /**
   * Model value updated
   */
  'update:modelValue': [value: T|null],
  /**
   * Change event
   */
  'change': [value: T|Error|null, rawValue?: VanyCheckValueType|null, context?: any],
}>();


const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Check label
   */
  default: () => any,
}>();
//#endregion

//#region Internal setup
// Register functions
const fwdFocus = new VanyFocusFunctionForwarder();

// Register the current input control
let renderService: VanyRegisteredFormItemRenderService|null = null;
if (typeof props.name === 'string') {
  renderService = useFormItemStateRenderService()?.registerControl(props.name, fwdFocus) ?? null;
}

// Create the host
const serviceHost = createVanyFormControlRenderServiceHost<T, VanyCheckValueType>({
  currentValue: props.modelValue,
  onUpdateValueFn: (value: T|null) => {
    emits('update:modelValue', value);
  },
  fwdFocus,
  codec: props.codec ?? _cast<VanyCodec<T, VanyCheckValueType>>(new VanyDummyCodec<VanyCheckValueType>),
  registeredControl: renderService,
  defaultValidateTrigger: 'change',
  controlNature: 'select',
});

serviceHost.onChangeEvent((value: T|Error|null, rawValue?: VanyCheckValueType|null, context?: any) => {
  emits('change', value, rawValue, context);
});

// Connect to the host
onMounted(() => serviceHost.notifyMounted(props.modelValue));
watch(() => props.modelValue, serviceHost.notifyWatch);
onBeforeUnmount(serviceHost.notifyBeforeUnmount);
//#endregion

//#region Renderer
const render = () => {
  const request: VanyCheckRenderRequest = {
    vanyClass: 'check',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    disabled: props.disabled,
    _render: serviceHost.export(),
  };

  return VanyInRegistry.render(request);
}
//#endregion
</script>

<template>
  <render />
</template>