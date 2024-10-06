<script setup lang="ts" generic="T = VanyRadioValue">
//#region Imports
import {
  _cast,
} from '@xirelogy/xwts';

import {
  onBeforeUnmount,
  onMounted,
  provide,
  useAttrs,
  watch,
} from 'vue';

import VanyRadioGroupRenderRequest from './requests/VanyRadioGroupRenderRequest';

import { useFormItemStateRenderService } from '../states/formItemState';
import VanyRegisteredFormItemRenderService from './services/VanyRegisteredFormItemRenderService';
import createVanyFormControlRenderServiceHost from '../internals/createVanyFormControlRenderServiceHost';
import VanyFocusFunctionForwarder from '../internals/comps/VanyFocusFunctionForwarder';
import { VanyCodec } from '../codecs/VanyCodec';
import VanyDummyCodec from '../codecs/VanyDummyCodec';

import {
  type VanyRadioValue,
} from '../types/VanyRadioValue';

import {
  KEY as inlineStateKey,
  createInlineState,
} from '../states/inlineState';

import VanyInRegistry from '../internals/VanyInRegistry';
import VanyRenderer from '../setup/VanyRenderer';
//#endregion

//#region Component definition
const props = withDefaults(defineProps<{
  modelValue: T|null,
  codec?: VanyCodec<T, VanyRadioValue>|null,
  name?: string|null,
  inline?: boolean,
  disabled?: boolean,
}>(), {
  modelValue: null,
  codec: null,
  name: null,
  inline: false,
  disabled: false,
});

const emits = defineEmits<{
  'update:modelValue': [value: T|null],
}>();

const attrs = useAttrs();

const slots = defineSlots<{
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
const serviceHost = createVanyFormControlRenderServiceHost<T, VanyRadioValue>({
  currentValue: props.modelValue,
  onUpdateValueFn: (value: T|null) => {
    emits('update:modelValue', value);
  },
  fwdFocus,
  codec: props.codec ?? _cast<VanyCodec<T, VanyRadioValue>>(new VanyDummyCodec<VanyRadioValue>),
  registeredControl: renderService,
  defaultValidateTrigger: 'change',
  controlNature: 'select',
});

// Connect to the host
onMounted(() => serviceHost.notifyMounted(props.modelValue));
watch(() => props.modelValue, serviceHost.notifyWatch);
onBeforeUnmount(serviceHost.notifyBeforeUnmount);

// Provide state
provide(inlineStateKey, createInlineState(props.inline));
//#endregion

//#region Renderer
const render = () => {
  const request: VanyRadioGroupRenderRequest = {
    vanyClass: 'radio-group',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    name: props.name ?? null,
    inline: props.inline,
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