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

import {
  useAutocompleteFwdNotifyKeyword,
} from '../states/autocompleteState';

import VanyInputRenderRequest from './requests/VanyInputRenderRequest';

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
   * DO NOT USE: the type attribute is placed here so that it is captured and discarded
   */
  type?: string,
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
  codec?: VanyCodec<T, string>|null,
  /**
   * If this is a password input (mask password)
   * @defaultValue false
   */
  password?: boolean,
  /**
   * If disabled
   * @defaultValue false
   */
  disabled?: boolean,
}>(), {
  name: null,
  modelValue: null,
  codec: null,
  password: false,
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
//#endregion

//#region Internal setup
// Register functions
const fwdFocus = new VanyFocusFunctionForwarder();

// Register the current input control
let renderService: VanyRegisteredFormItemRenderService|null = null;
if (typeof props.name === 'string') {
  renderService = useFormItemStateRenderService()?.registerControl(props.name, fwdFocus) ?? null;
}

// Connect to autocomplete if available
const fwdAutocomplete = useAutocompleteFwdNotifyKeyword();

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
  fwdAutocomplete?.call(value); // Forward to autocomplete if applicable
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
  const request: VanyInputRenderRequest = {
    vanyClass: 'input',
    attrs: VanyRenderer.acceptAttrs(attrs),
    slots: slots,
    name: props.name,
    password: props.password,
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