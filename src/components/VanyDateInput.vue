<script setup lang="ts" generic="T = VanyStableDateValue">
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

import VanyDateInputRenderRequest from './requests/VanyDateInputRenderRequest';

import { VanyStableDateValue } from '../types/VanyStableDateValue';
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
   */
  codec?: VanyCodec<T, VanyStableDateValue>|null,
  /**
   * If disabled
   */
  disabled?: boolean,
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
}>();

const attrs = useAttrs();

const slots = defineSlots<{
  /**
   * Main content (normally unused)
   */
  default?: () => any,
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
const serviceHost = createVanyFormControlRenderServiceHost<T, VanyStableDateValue>({
  currentValue: props.modelValue,
  onUpdateValueFn: (value: T|null) => {
    emits('update:modelValue', value);
  },
  fwdFocus,
  codec: props.codec ?? _cast<VanyCodec<T, VanyStableDateValue>>(new VanyDummyCodec<VanyStableDateValue>),
  registeredControl: renderService,
  defaultValidateTrigger: 'blur',
  controlNature: 'input',
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
  const request: VanyDateInputRenderRequest = {
    vanyClass: 'date-input',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    name: props.name,
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